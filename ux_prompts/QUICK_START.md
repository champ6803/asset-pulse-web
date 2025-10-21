# Asset Pulse - UX Pilot Quick Start Guide

## 🎯 เริ่มต้นอย่างรวดเร็ว

### สำหรับ AI Design Tools (V0, Midjourney, Claude)

#### วิธีที่ 1: ใช้ Overall Prompt + Specific Screen
```
1. เปิดไฟล์ 00_overall_prompt.md คัดลอกทั้งหมด
2. เปิดไฟล์หน้าที่ต้องการ เช่น 04_ai_recommendations.md
3. รวมทั้งสองไฟล์เข้าด้วยกัน:

[วาง overall prompt]

---

Screen to generate:
[วาง specific screen prompt]
```

#### วิธีที่ 2: ใช้ Specific Screen อย่างเดียว (สั้นกว่า)
```
เปิดไฟล์หน้าที่ต้องการ เช่น 03_new_hire_form.md
คัดลอก prompt
ใช้งานกับ AI tool โดยตรง
```

## 📱 หน้าจอที่ควรทำก่อน (Priority Order)

### 🔥 สำคัญที่สุด (ทำก่อน)
1. **01_login_screen.md** - หน้า Login พื้นฐาน
2. **03_new_hire_form.md** - ฟอร์มเพิ่มพนักงานใหม่ (Step 1) ⭐
3. **04_ai_recommendations.md** - แสดงผล AI แนะนำซอฟต์แวร์ (Step 2) ⭐
4. **03b_review_summary.md** - รีวิวสรุปก่อน Submit (Step 3) ⭐
5. **11_seat_optimization_dashboard.md** - Dashboard จัดการ License ที่ไม่ใช้ ⭐
6. **12_reallocation_details.md** - หน้ารายละเอียดการย้าย License ⭐

### 📊 สำคัญรองลงมา
6. **02_employee_dashboard.md** - Dashboard พนักงาน
7. **07_manager_dashboard.md** - Dashboard ผู้จัดการ
8. **10_cto_dashboard.md** - Dashboard CTO
9. **08_template_list.md** - รายการ Template
10. **17_approval_queue.md** - คิวอนุมัติ

### 🎨 เสริม (ทำทีหลัง)
11. **14_similar_software_detection.md** - ตรวจจับซอฟต์แวร์ซ้ำ
12. **15_consolidation_details.md** - รายละเอียดการรวมสัญญา
13. **16_ai_memo_generation.md** - AI สร้าง Business Case Memo
14. **19_my_licenses.md** - License ของฉัน
15. **20_usage_analytics.md** - วิเคราะห์การใช้งาน

## 🎨 ตัวอย่างการใช้งาน

### ตัวอย่าง 1: Generate กับ V0.dev
```
1. ไปที่ https://v0.dev
2. คัดลอก prompt จาก 04_ai_recommendations.md
3. เพิ่มข้อความ:
   "Use Next.js 14, Tailwind CSS, and shadcn/ui components. 
    Make it responsive and modern."
4. กด Generate
5. ปรับแต่งตามต้องการ
```

### ตัวอย่าง 2: Generate กับ Midjourney
```
1. คัดลอก prompt จาก 02_employee_dashboard.md
2. เพิ่มหน้า prompt:
   "modern enterprise web application UI, clean professional design, 
    SCBX Group branding, --ar 16:9 --v 6"
3. Paste ใน Midjourney
4. Generate และใช้เป็น reference
```

### ตัวอย่าง 3: Generate กับ Claude AI
```
1. คัดลอก 00_overall_prompt.md
2. พิมพ์ใน Claude:
   "Based on this design system, create detailed Figma specifications 
    for [copy prompt from specific screen file]"
3. Claude จะให้ spec แบบละเอียด
```

## 🎨 Design System สั้นๆ

### สี
```
Primary:   #1E3A8A (น้ำเงินเข้ม)
Secondary: #3B82F6 (น้ำเงินสด)
Success:   #10B981 (เขียว)
Warning:   #F59E0B (เหลือง/ส้ม)
Danger:    #EF4444 (แดง)
```

### Font
- **ตัวอักษร**: Inter
- **ขนาด**: H1 36px, H2 30px, H3 24px, Body 16px

### Spacing
- ช่องว่าง: 8px, 16px, 24px, 32px, 48px

### Border Radius
- ปุ่ม: 8px
- การ์ด: 12px
- Input: 6px

## 🔧 เครื่องมือแนะนำ

### สำหรับ Prototype
1. **V0.dev** - Generate React code โดยตรง
2. **Bolt.new** - Generate full-stack app
3. **Lovable.dev** - AI web builder

### สำหรับ Design Mockup
1. **Midjourney** - High-quality UI mockups
2. **DALL-E 3** - Quick UI concepts
3. **Ideogram** - Text on images

### สำหรับ Design System
1. **Figma** - Professional design tool
2. **Penpot** - Open source alternative
3. **Framer** - Design + Prototype

## 💡 Pro Tips

1. **เริ่มจาก Overall Prompt**: อ่าน `00_overall_prompt.md` ก่อนเสมอ เพื่อเข้าใจ design system

2. **ทำทีละหน้า**: อย่าพยายามทำทุกหน้าพร้อมกัน เริ่มจาก Priority สูงก่อน

3. **ใช้ Components ซ้ำ**: เมื่อทำ Card, Button, Input เสร็จแล้ว ใช้ซ้ำในหน้าอื่นๆ

4. **Test Responsive**: แต่ละหน้าต้องทำงานได้บน Desktop, Tablet, Mobile

5. **AI Features เด่น**: ทำให้ AI recommendations มองเห็นชัดเจน ใช้สี highlight และ icon 🤖

6. **ทดสอบกับ User**: ถ้าทำได้ ให้คนจริงๆ ทดสอบใช้งาน

## 📋 Checklist

### Phase 1 (สัปดาห์ที่ 1)
- [ ] 01 - Login Screen
- [ ] 02 - Employee Dashboard
- [ ] 03 - New Hire Form (Step 1) ⭐
- [ ] 04 - AI Recommendations (Step 2) ⭐
- [ ] 03b - Review Summary (Step 3) ⭐
- [ ] 05 - AI Rationale Modal
- [ ] 06 - Request Confirmation

### Phase 2 (สัปดาห์ที่ 2)
- [ ] 07 - Manager Dashboard
- [ ] 08 - Template List
- [ ] 09 - Template Creation
- [ ] 10 - CTO Dashboard
- [ ] 11 - Seat Optimization ⭐
- [ ] 12 - Reallocation Details ⭐

### Phase 3 (สัปดาห์ที่ 3)
- [ ] 13 - Group CTO Dashboard
- [ ] 14 - Similar Software Detection
- [ ] 15 - Consolidation Details
- [ ] 16 - AI Memo Generation
- [ ] 17 - Approval Queue

### Phase 4 (สัปดาห์ที่ 4)
- [ ] 18 - Request Details
- [ ] 19 - My Licenses
- [ ] 20 - Usage Analytics

## 🚀 Next Steps

1. อ่าน `README.md` สำหรับข้อมูลโดยละเอียด
2. อ่าน `00_overall_prompt.md` สำหรับ design system
3. เริ่มทำหน้าแรก (01_login_screen.md)
4. ทำตาม Priority order
5. Test และ iterate

## 📞 อ้างอิง

- **UX Spec เต็ม**: `/spec/ux-specification.md`
- **Requirements เต็ม**: `/spec/requirement.md`
- **Database Schema**: `/scripts/0001_initial_tables.sql`

---

**สำเร็จแล้ว! เริ่มต้นได้เลย 🎉**

