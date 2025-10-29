## Volume Pricing Spec (DB, API, Logic)

เอกสารนี้สรุปสคีมาที่เพิ่มใหม่, กติกาการ lookup ราคา, โฟลว์การคำนวณ, และ API ที่ต้องใช้สำหรับฟีเจอร์ Similar Software + Potential Saving ภายใต้เรทราคาตามจำนวน

### ตารางที่เพิ่มใหม่ (จากสคริปต์ 0006_volume_pricing_and_mock.sql)

- `app_volume_pricing_tiers`
  - ฟิลด์: `id`, `app_id`, `threshold_qty` (INT), `unit_price` (NUMERIC), `currency` (VARCHAR), `billing_period` (VARCHAR: monthly/yearly), `pricing_mode` (VARCHAR: piecewise/progressive, nullable), `is_active` (BOOL), `effective_from` (DATE), `effective_to` (DATE), `created_at`, `created_by`, `updated_at`, `updated_by`
  - ดัชนี: `ix_app_vol_tier_app(app_id, is_active)`
  - Unique (ผ่าน expression index): `uq_app_vol_tier(app_id, threshold_qty, currency, billing_period, COALESCE(effective_from,'1900-01-01'))`
  - ความหมาย: Tier ต่อแอป (priority สูงกว่า vendor)

- `vendor_volume_pricing_tiers`
  - ฟิลด์: `id`, `vendor_id`, `feature_cluster_key` (เช่นหมวดหมู่จาก `apps.category`), `threshold_qty`, `unit_price`, `currency`, `billing_period`, `pricing_mode` (nullable), `is_active`, `effective_from`, `effective_to`, `created_at`, `created_by`, `updated_at`, `updated_by`
  - ดัชนี: `ix_vendor_vol_tier(vendor_id, feature_cluster_key, is_active)`
  - ความหมาย: Tier ต่อผู้ขาย + คลัสเตอร์ฟีเจอร์ (fallback เมื่อไม่มีแบบต่อแอป)

- `switching_cost_policy`
  - ฟิลด์: `id`, `feature_cluster_key`, `training_cost_per_user` (NUMERIC), `migration_flat_cost` (NUMERIC), `early_termination_penalty_rate` (NUMERIC 0..1), `created_at`, `created_by`, `updated_at`, `updated_by`
  - Unique: `feature_cluster_key`
  - ความหมาย: Policy ค่าใช้จ่ายในการย้ายระบบต่อคลัสเตอร์ฟีเจอร์

หมายเหตุ: มีการ seed mock tiers และ policy ให้พร้อมใช้งาน โดยอ้างอิงราคาจาก `price_books`

### ตาราง/ข้อมูลที่ใช้เดิม (สำคัญต่อการคำนวณ)

- `apps`, `vendors`, `contracts`, `contract_terms(price_per_seat, seat_committed, uom)`, `price_books(list_price, unit, tier, currency, valid_from, valid_to)`, `license_inventories(total_seats, effective_date, expire_date)`, `license_assignments`, `usage_events`, `app_similarity`

### กติกา Lookup ราคา (Priority Order)

สำหรับซอฟต์แวร์ i, จำนวนที่นั่ง U_i, สกุลเงิน/รอบบิลที่ normalize แล้ว:

1) ราคาปัจจุบัน (Current Unit Price per app)
   - ถ้ามีสัญญา: ใช้ `contract_terms.price_per_seat` เป็น p_i_contract
   - ถ้าไม่มี: ใช้ `price_books.list_price` ตาม tier/unit/currency/ช่วงเวลา เป็น p_i_list
   - คำนวณต้นทุนต่อแอป: C_i = U_i × p_i (p_i เลือกจาก contract ก่อน, ไม่มีก็ list)

2) Volume Pricing สำหรับ Proposed (เป้าหมายรวมเข้าแอป j*)
   - หา tier จาก `app_volume_pricing_tiers` ของ j* (is_active, currency, billing_period, effective window)
   - ถ้าไม่พบ → หาใน `vendor_volume_pricing_tiers` โดยใช้ (vendor_id ของ j*, feature_cluster_key ของคลัสเตอร์)
   - เลือก `pricing_mode`: ถ้าระบุใน tier ให้ใช้; ถ้าไม่ระบุ ให้ default = piecewise

3) สูตรคำนวณ Tier
   - Piecewise: C(U) = U × r_k ที่ k คือ tier สูงสุดที่ U ถึง
   - Progressive: C(U) = Σ_k r_k × (min(U, q_{k+1}-1) − q_k + 1)_+

4) Switching Cost
   - จาก `switching_cost_policy` ตาม `feature_cluster_key`
   - C_switch = U_migrating × training_cost_per_user + migration_flat_cost + penalty
   - penalty = early_termination_penalty_rate × RemainingContractValue (คำนวณจาก `contract_terms` + เวลาเหลือ)

### โฟลว์การคำนวณใน Similar Software

สำหรับคลัสเตอร์ g (เช่น apps.category / feature grouping จาก `app_similarity`):

1) Current Cost
   - รวมแอปในคลัสเตอร์ g → ดึง U_i จาก `license_assignments` หรือ `license_inventories`
   - คำนวณ C_i ต่อแอปตามราคาปัจจุบัน → C_current = Σ_i C_i

2) Proposed Cost (เลือก j*)
   - U_total = Σ_i U_i
   - Lookup tier ของ j* → คำนวณ C_proposed,licenses ตาม piecewise/progressive
   - C_proposed = C_proposed,licenses + C_switch

3) Savings
   - S = C_current − C_proposed,   S% = S / C_current × 100%

### สัญญา API (เสนอ)

- `GET /api/similar-software/clusters`
  - Resp: รายการคลัสเตอร์ g พร้อมสมาชิก: apps, U_i ต่อแอป, ราคาปัจจุบันต่อแอป, C_current ต่อคลัสเตอร์

- `GET /api/vendors/pricing-tiers`
  - Query: `appId?` หรือ `vendorId&clusterKey`
  - Resp: tier list (app-level ก่อน ถ้ามี; otherwise vendor-level), pricing_mode, currency, billing_period

- `POST /api/similar-software/saving-simulation`
  - Body: `{ clusterKey: string, targetAppId: number, currency: 'THB'|'USD', billingPeriod: 'monthly'|'yearly' }`
  - Resp: `{ currentCost, proposedLicensesCost, switchingCost, proposedTotal, saving, savingPct, chosenMode: 'piecewise'|'progressive', tiersUsed: [...]} `

### ข้อกำหนดการ Normalize

- Currency: กำหนด base currency (เช่น THB) และทำ FX conversion ก่อนคำนวณ
- Billing period: แปลงทั้งหมดเป็นรายเดือนหรือรายปีเดียวกัน
- Effective window: เลือก tier ที่ `effective_from <= today <= effective_to OR effective_to IS NULL`

### Edge Cases

- ไม่มี tier ใดเลยทั้ง app/vendor → แจ้งเตือน และใช้ p_i ปัจจุบันเพื่อเปรียบเทียบระดับ high-level เท่านั้น
- progressive tiers มีช่องว่าง q_k ต้องเรียงและไม่มี overlap
- U_total ใหญ่กว่าช่วงสูงสุด → ใช้ tier สุดท้าย

### ตัวอย่างข้อมูล (ย่อ)

- app_volume_pricing_tiers: j* = Zoom
  - (1, 20.00 THB), (50, 15.00 THB), (200, 10.00 THB) piecewise/monthly
- vendor_volume_pricing_tiers: vendor=Microsoft, cluster="Collaboration"
  - (1, 22.00 THB), (100, 18.00 THB), (300, 15.00 THB) piecewise/monthly
- switching_cost_policy: "Collaboration"
  - training=900, migration=120,000, penaltyRate=0.15

### Implementation Notes

- สร้าง repository/query สำหรับ tier lookup สองระดับ พร้อมแคช 5 นาที
- ฟังก์ชันคำนวณต้นทุนรับอินพุต: tiers[], mode, U → คืนค่า C(U)
- สรุปผลต่อคลัสเตอร์โดยคืนรายการ tier ที่ถูกใช้จริง (เพื่อ UI แสดง rationale)


