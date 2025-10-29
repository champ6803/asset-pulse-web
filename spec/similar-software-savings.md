## การคำนวณ Potential Saving สำหรับหน้า Similar Software (มีเรทราคาตามจำนวน)

เอกสารนี้อธิบายโครงสร้างข้อมูล (database), กติกาทางธุรกิจ (business rules), และสูตรคณิตศาสตร์สำหรับคำนวณ Potential Saving เมื่อทำการรวมซอฟต์แวร์ที่คล้ายกัน (similar/overlapping functionality) ไปยังผู้ขาย/แพ็กเกจเดียว โดยพิจารณา “ส่วนลดตามจำนวน” (quantity-based discount / tiered pricing).

### วัตถุประสงค์
- คำนวณต้นทุนปัจจุบัน (Current Cost) เทียบกับต้นทุนหลังการรวม (Consolidated Cost) ภายใต้โมเดลส่วนลดตามจำนวน เพื่อได้ Potential Saving ที่โปร่งใส ตรวจสอบได้ และปรับพารามิเตอร์ได้

### คำจำกัดความและสัญลักษณ์
- \( i \): ดัชนีซอฟต์แวร์/ผู้ขาย
- \( U_i \): จำนวนผู้ใช้/ที่นั่ง (licenses) ปัจจุบันของซอฟต์แวร์ \( i \)
- \( p_i \): ราคาต่อหน่วย (หน่วย/เดือน หรือ หน่วย/ปี) ของซอฟต์แวร์ \( i \) ก่อนส่วนลดแบบ volume
- \( T^{(i)} = \{(q^{(i)}_k, r^{(i)}_k)\}_{k=1..K_i} \): ตาราง tier ราคา (threshold-to-rate) ของผู้ขาย \( i \) โดย \( q^{(i)}_k \) คือจำนวนขั้นต่ำของ tier ที่ \( k \) และ \( r^{(i)}_k \) คือราคาต่อหน่วยของ tier นั้น
- \( U^{\text{total}} \): จำนวนที่นั่งรวมหลังการรวมหลายผลิตภัณฑ์เข้าด้วยกันเพื่อซื้อจากผู้ขายรายเดียว
- \( C_{\text{current}} \): ต้นทุนรวมปัจจุบัน
- \( C_{\text{proposed}} \): ต้นทุนรวมหลังการรวม (ภายใต้ส่วนลดตามจำนวน)
- \( C_{\text{switch}} \): ค่าใช้จ่ายในการสลับ/ย้ายระบบ (migration/training/penalty/etc.)
- \( S \): Potential Saving

### โครงสร้างข้อมูลที่ใช้ได้ในฐานข้อมูลปัจจุบัน และสิ่งที่ต้องเสริม
อ้างอิงจากสคริปต์ในโฟลเดอร์ `asset-pulse-api/scripts` (PostgreSQL):

- ตารางที่มีอยู่แล้ว (ใช้ได้ทันที)
  - `apps` (แคตตาล็อกซอฟต์แวร์)
  - `vendors` (ผู้ขาย)
  - `contracts` (สัญญารวมกับผู้ขาย)
  - `contract_terms` (เงื่อนไขราคาต่อแอปในสัญญา: `seat_committed`, `price_per_seat`, `uom`)
  - `license_inventories` (สต็อก/สิทธิ์ที่ซื้อมา: `total_seats`, `effective/expire_date`)
  - `license_assignments` (การจัดสรรสิทธิ์ลงผู้ใช้ ใช้หาจำนวนที่นั่งที่ใช้งานจริง)
  - `usage_events` (เหตุการณ์การใช้งาน ช่วยตัดสิน downgrade/revoke)
  - `price_books` (ราคา list ต่อ tier/หน่วย/สกุลเงิน ช่วงเวลา `valid_from/valid_to`)
  - `app_similarity` (ความคล้ายคลึงระหว่างแอป ใช้จัดกลุ่ม similar software)
  - `group_consolidation_opps` (พื้นที่เก็บ snapshot โอกาส consolidation ระดับกลุ่ม) — optional

- ตาราง/วิวที่แนะนำให้เสริมเพื่อ “เรทราคาตามจำนวนต่อแอป/ต่อผู้ขาย”
  - `app_volume_pricing_tiers` (ใหม่) — กติกา tier ตามจำนวน ต่อแอป
    - `id`, `app_id`, `threshold_qty` (INT), `unit_price` (NUMERIC), `currency` (VARCHAR), `billing_period` (ENUM: monthly/yearly), `pricing_mode` (ENUM: piecewise/progressive, nullable), `is_active` (BOOL), `effective_from`, `effective_to`
    - UNIQUE: (`app_id`,`threshold_qty`,`currency`,`billing_period`,`effective_from`)
  - `vendor_volume_pricing_tiers` (ใหม่) — กติกา tier ตามจำนวน ต่อผู้ขาย/คลัสเตอร์ฟีเจอร์ (fallback)
    - `id`, `vendor_id`, `feature_cluster_key` (nullable), `threshold_qty`, `unit_price`, `currency`, `billing_period`, `pricing_mode` (nullable), `is_active`, `effective_from`, `effective_to`
    - INDEX: (`vendor_id`,`feature_cluster_key`,`currency`,`billing_period`,`is_active`)
  - `switching_cost_policy` (ใหม่/เสริม) — นโยบายค่าใช้จ่ายย้ายระบบตามคลัสเตอร์ฟีเจอร์
    - `id`, `feature_cluster_key`, `training_cost_per_user`, `migration_flat_cost`, `early_termination_penalty_rate`

หมายเหตุ: สำหรับราคาปัจจุบัน ให้ใช้ `contract_terms.price_per_seat` เป็นอันดับแรก ถ้าไม่มีให้ fallback ไป `price_books.list_price` ตาม tier ที่สอดคล้อง และแปลงรอบบิล/สกุลเงินให้เป็นฐานเดียวกันก่อนคำนวณ

### โมเดลส่วนลดตามจำนวน (Quantity-Based Pricing)
รองรับ 2 โมเดลที่พบบ่อย:

1) โมเดล "Piecewise Single-Tier" (ทุกหน่วยคิดตามราคาของ tier สูงสุดที่ถึง)
- ถ้า \( U \) อยู่ในช่วง tier ที่ \( k \) ให้ราคาต่อหน่วยเป็น \( r_k \) สำหรับทุกหน่วย
- ต้นทุนรวม: \[ C(U) = U \cdot r_k \quad \text{where } k = \max\{ k' : U \ge q_{k'} \} \]

2) โมเดล "Progressive Tier" (หน่วยในแต่ละช่วงคิดราคาตามช่วงนั้น แล้วบวกกัน)
- ให้กำหนดช่วงเป็น \([q_1, q_2), [q_2, q_3), \dots, [q_K, +\infty))\)
- ต้นทุนรวม: \[
  C(U) = \sum_{k=1}^{K} r_k \cdot \big(\min(U, q_{k+1}-1) - q_k + 1\big)_{+}
\]
โดย \((x)_{+} = \max(x, 0)\) และนิยาม \( q_{K+1} = +\infty \) เพื่อให้ช่วงสุดท้ายเปิดไม่จำกัด

แต่ละ `vendor + feature_cluster_key` ต้องกำหนด `pricing_mode ∈ {piecewise, progressive}` ชัดเจนเพื่อเลือกสูตร

### ต้นทุนปัจจุบัน (Current Cost)
ลำดับการหา “ราคาปัจจุบันต่อแอป” สำหรับบริษัท/สัญญา:

1) ถ้ามีสัญญา: ใช้ `contract_terms.price_per_seat` ของแอปนั้นเป็น \( p_i^{contract} \)

2) ถ้าไม่มีในสัญญา: ใช้ `price_books.list_price` ที่ตรงกับ `tier`/`unit`/`currency`/ช่วงเวลา มาเป็น \( p_i^{list} \)

3) ถ้ามีกติกา volume เดิมระดับแอปอยู่แล้ว (กรณีเสริมตาราง `app_volume_pricing_tiers`):
   - หาก `pricing_mode = piecewise` ใช้ \( C_i = U_i \cdot r^{(i)}_k \)
   - หาก `pricing_mode = progressive` ใช้ \( C_i = \sum_k r^{(i)}_k \cdot (\dots) \)
   - มิฉะนั้น หากไม่มีกติกา volume เดิม ให้ \( C_i = U_i \cdot p_i \) โดย \( p_i = p_i^{contract} \) ถ้ามี ไม่เช่นนั้นใช้ \( p_i^{list} \)

สุดท้าย รวมทุกแอปในคลัสเตอร์/องค์กร:
\[ C_{\text{current}} = \sum_{i} C_i \]

### ต้นทุนหลังการรวม (Consolidated Cost)
สมมุติเลือกแอปเป้าหมาย \( j^* \) (จากผู้ขาย \( v^* \)) ในคลัสเตอร์ `feature_cluster_key = g` เพื่อรวม

1) รวมจำนวนที่นั่งทั้งหมดในคลัสเตอร์: \[ U^{\text{total}} = \sum_{i \in g} U_i \]

2) Lookup tier ของแอปเป้าหมาย \( j^* \):
   - หาใน `app_volume_pricing_tiers` ก่อน ถ้าไม่พบให้หาใน `vendor_volume_pricing_tiers` โดยใช้ (`vendor_id`, `feature_cluster_key = g`)
   - เลือก `pricing_mode` ตามกติกาที่พบ (default = piecewise ถ้าไม่ระบุ)

3) คำนวณราคาตามโมเดลส่วนลดของ \( j^* \):
- ถ้า `pricing_mode = piecewise`:
\[ C_{\text{proposed, licenses}} = U^{\text{total}} \cdot r^{(j^*)}_{k}, \quad k = \max\{k' : U^{\text{total}} \ge q^{(j^*)}_{k'}\} \]

- ถ้า `pricing_mode = progressive`:
\[ C_{\text{proposed, licenses}} = \sum_{k} r^{(j^*)}_{k} \cdot \big(\min(U^{\text{total}}, q^{(j^*)}_{k+1}-1) - q^{(j^*)}_{k} + 1\big)_{+} \]

3) บวกค่าใช้จ่ายในการสลับระบบ (ถ้ามี)
\[ C_{\text{proposed}} = C_{\text{proposed, licenses}} + C_{\text{switch}} \]

โดย \( C_{\text{switch}} \) อาจประกอบด้วย:
- Training: \( C_{\text{train}} = U^{\text{migrating}} \cdot c_{\text{train}} \)
- Migration Flat: \( C_{\text{mig}} = c_{\text{mig}} \)
- Early Termination Penalty: \( C_{\text{pen}} = r_{\text{pen}} \cdot \text{RemainingContractValue} \)

รวม: \[ C_{\text{switch}} = C_{\text{train}} + C_{\text{mig}} + C_{\text{pen}} \]

### Potential Saving
\[ S = C_{\text{current}} - C_{\text{proposed}} \]

อาจแสดงผลเป็นสัดส่วน: \( S\% = \dfrac{S}{C_{\text{current}}} \times 100\% \)

### อัลกอริทึมการคำนวณ (ในหน้า Similar Software)
สำหรับแต่ละ `feature_cluster_key`:
1. ดึงรายการซอฟต์แวร์ในคลัสเตอร์และจำนวนที่นั่ง \( U_i \) พร้อมราคาปัจจุบันหรือคำนวณตาม tier รายผลิตภัณฑ์ เพื่อได้ \( C_{\text{current}} \)
2. รวบยอดจำนวน \( U^{\text{total}} \)
3. สำหรับผู้ขายเป้าหมายที่รองรับคลัสเตอร์นั้น ๆ คำนวณ \( C_{\text{proposed, licenses}} \) ตาม `pricing_mode` และตาราง tier ของผู้ขาย
4. ประเมิน \( C_{\text{switch}} \) จากนโยบาย (training, migration, penalty)
5. ได้ \( C_{\text{proposed}} \) และ \( S \)
6. เลือกผู้ขายที่ให้ \( S \) สูงสุด หรือให้ผู้ใช้ลองสลับตัวเลือกผู้ขายเพื่อดู \( S \) แบบ interactive

### ตัวอย่างสั้น (Piecewise)
- Tier ผู้ขาย (เดือน):
  - \( q_1=1, r_1=20 \)
  - \( q_2=50, r_2=15 \)
  - \( q_3=200, r_3=10 \)
- ปัจจุบันมี 3 แอปในคลัสเตอร์เดียวกัน: รวม \( U^{\text{total}} = 120 \)
- ดังนั้น \( k=3 \) (เพราะ 120 ≥ 200? ไม่ถึง ดังนั้นจริง ๆ คือ \( k=2 \) เนื่องจาก 120 ≥ 50 แต่ < 200)
- ต้นทุนใบอนุญาตหลังรวม: \( 120 \cdot 15 = 1{,}800 \)
- ถ้า \( C_{\text{switch}} = 5{,}000 \) และ \( C_{\text{current}} = 10{,}000 \)
  - \( C_{\text{proposed}} = 1{,}800 + 5{,}000 = 6{,}800 \)
  - \( S = 10{,}000 - 6{,}800 = 3{,}200 \) (\( S\% = 32\% \))

### เอ็นพอยน์ต์ที่เกี่ยวข้อง (เสนอ)
- `GET /api/similar-software/clusters` → รายการคลัสเตอร์, ซอฟต์แวร์ในคลัสเตอร์, จำนวนที่นั่ง, ราคาปัจจุบัน
- `GET /api/vendors/pricing-tiers?cluster_key={g}` → ตาราง tier + `pricing_mode`
- `POST /api/similar-software/saving-simulation` → รับ input: cluster, target_vendor, switching_policy → คืนผล \( C_{\text{current}}, C_{\text{proposed}}, S \)

### ประเด็นที่ต้องตัดสินใจ/ตั้งค่า
- เลือก `pricing_mode` ต่อผู้ขาย + คลัสเตอร์ (piecewise vs progressive) ให้ชัด
- การจัดกลุ่มซอฟต์แวร์ (`feature_cluster_key`) ต้องมีเหตุผลทางฟังก์ชันการใช้งาน
- การคิด \( C_{\text{switch}} \) ให้โปร่งใสและตั้งค่าได้ในระดับองค์กร
- การทำ normalization ของรอบบิล (รายเดือน vs รายปี) ควรแปลงให้อยู่ฐานเวลาเดียวกันก่อนคำนวณ

### เอาต์พุตที่แนะนำสำหรับ UI
- แสดง \( C_{\text{current}}, C_{\text{proposed}}, S, S\% \)
- แผนภูมิเปรียบเทียบก่อน/หลัง และตาราง tier ที่ถูกเลือกอัตโนมัติ
- Toggle เลือกผู้ขายเป้าหมายและนโยบาย switching เพื่อเห็นผลทันที


