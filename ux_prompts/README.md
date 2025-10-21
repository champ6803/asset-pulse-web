# Asset Pulse - UX Pilot Prompts

## 📁 Folder Structure

```
ux_prompts/
├── 00_overall_prompt.md          # Overall UX guidelines (< 10,000 chars)
├── 01_login_screen.md            # Login page
├── 02_employee_dashboard.md      # Employee/HR dashboard
├── 03_new_hire_form.md           # New hire request form (Step 1)
├── 03b_review_summary.md         # Review summary (Step 3)
├── 04_ai_recommendations.md      # AI recommendation results (Step 2)
├── 05_ai_rationale_modal.md      # AI explanation modal
├── 06_request_confirmation.md    # Success confirmation
├── 07_manager_dashboard.md       # Department Manager dashboard
├── 08_template_list.md           # Template management list
├── 09_template_creation.md       # Create/edit template
├── 10_cto_dashboard.md           # Subsidiary CTO dashboard
├── 11_seat_optimization_dashboard.md  # Seat optimization overview
├── 12_reallocation_details.md    # License reallocation details
├── 13_group_cto_dashboard.md     # Group CTO dashboard
├── 14_similar_software_detection.md   # Cross-sub software matching
├── 15_consolidation_details.md   # Consolidation opportunity
├── 16_ai_memo_generation.md      # AI-generated business case memo
├── 17_approval_queue.md          # Approval workflow queue
├── 18_request_details.md         # Request details & approval
├── 19_my_licenses.md             # Personal licenses view
└── 20_usage_analytics.md         # Usage analytics dashboard
```

## 🎯 How to Use

### For AI Image Generation (V0, Midjourney, DALL-E)

1. **Start with Overall Prompt**: Read `00_overall_prompt.md` first to understand:
   - Design language (colors, typography, spacing)
   - Core principles (AI-first, clarity, efficiency)
   - Component library (cards, buttons, badges)
   - User roles and navigation

2. **Generate Individual Screens**: For each screen (01-20):
   - Copy the prompt from the respective `.md` file
   - Use with V0, Midjourney, or other AI design tools
   - Append overall design guidelines if needed

3. **Combine Prompts**: You can combine overall prompt + specific screen:
   ```
   [Overall design guidelines from 00_overall_prompt.md]
   
   Specific screen: [Prompt from XX_screen_name.md]
   ```

### For Manual Design (Figma, Adobe XD)

Use these prompts as **design specifications**:
- Each prompt describes layout, components, interactions
- Follow the overall design system in `00_overall_prompt.md`
- Create components library first (buttons, cards, inputs)
- Design screens in priority order (see below)

## 📋 Screen Priorities

### Phase 1 (MVP - Feature 3 & 4)
1. ✅ 01 - Login Screen
2. ✅ 02 - Employee Dashboard
3. ⭐ 03 - New Hire Form (Step 1)
4. ⭐ 04 - AI Recommendations (Step 2)
5. ⭐ 03b - Review Summary (Step 3)
6. ⭐ 05 - AI Rationale Modal
7. ⭐ 06 - Request Confirmation
7. ✅ 08 - Template List
8. ✅ 09 - Template Creation

### Phase 2 (Feature 5 - Seat Optimization)
9. ✅ 10 - CTO Dashboard
10. ⭐ 11 - Seat Optimization Dashboard
11. ⭐ 12 - Reallocation Details
12. ✅ 17 - Approval Queue
13. ✅ 18 - Request Details

### Phase 3 (Feature 1 & 2 - Consolidation)
14. ✅ 13 - Group CTO Dashboard
15. ⭐ 14 - Similar Software Detection
16. ⭐ 15 - Consolidation Details
17. ⭐ 16 - AI Memo Generation

### Phase 4 (Supporting)
18. ✅ 07 - Manager Dashboard
19. ✅ 19 - My Licenses
20. ✅ 20 - Usage Analytics

## 🎨 Design Tokens (Quick Reference)

### Colors
- Primary: `#1E3A8A` (Deep Blue)
- Secondary: `#3B82F6` (Bright Blue)
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Amber)
- Danger: `#EF4444` (Red)
- Background: `#F8FAFC`
- Surface: `#FFFFFF`
- Text: `#0F172A`

### Typography
- Font: Inter
- H1: 36px Bold
- H2: 30px Bold
- H3: 24px SemiBold
- Body: 16px Regular
- Small: 14px Regular

### Spacing
- Base: 8px
- Small: 16px
- Medium: 24px
- Large: 32px
- XLarge: 48px

### Border Radius
- Buttons: 8px
- Cards: 12px
- Inputs: 6px
- Modals: 16px

## 🔑 Key Features by Screen

### Feature 3: AI Job Description Matching
- Screens: 03 (Step 1), 04 (Step 2), 03b (Step 3), 05, 06
- Priority: ⭐⭐⭐ HIGH

### Feature 4: Purchase Templates
- Screens: 08, 09
- Priority: ⭐⭐ MEDIUM

### Feature 5: Seat Optimization with Reallocation
- Screens: 11, 12
- Priority: ⭐⭐⭐ HIGH

### Feature 1: Cross-Subsidiary Matching
- Screens: 14
- Priority: ⭐⭐ MEDIUM

### Feature 2: Group Consolidation
- Screens: 15, 16
- Priority: ⭐⭐ MEDIUM

## 💡 Tips for AI Generation

1. **V0 (Vercel)**: Works best with detailed component descriptions
   - Include Tailwind CSS classes hints
   - Mention React components if using Next.js
   - Example: "Use shadcn/ui card component with Tailwind"

2. **Midjourney/DALL-E**: Best for visual mockups
   - Start with "modern enterprise web application UI"
   - Specify aspect ratio: `--ar 16:9` for desktop
   - Add keywords: "clean", "professional", "SCBX branding"

3. **Claude AI (Design)**: Best for detailed Figma specs
   - Ask for Auto Layout specifications
   - Request component variants
   - Generate design system documentation

## 📊 Screen Complexity

- **Simple** (5-10 min): 01, 06, 19
- **Medium** (15-20 min): 02, 03, 07, 08, 10, 13, 17
- **Complex** (30-40 min): 04, 09, 11, 12, 14, 15, 16, 18, 20

## 🚀 Quick Start Example

```bash
# Generate Login Screen with V0
1. Copy prompt from: 01_login_screen.md
2. Go to: https://v0.dev
3. Paste prompt
4. Add: "Use Next.js, Tailwind CSS, and shadcn/ui"
5. Generate and iterate

# Or use with Midjourney
1. Copy prompt from: 02_employee_dashboard.md
2. Prefix with: "modern enterprise web app UI, clean design, --ar 16:9"
3. Generate in Midjourney
4. Use as design reference
```

## 📝 Notes

- All prompts are self-contained but reference the overall design system
- Prompts include layout, components, interactions, and data
- Can be used directly with AI tools or as specifications for manual design
- Character count for overall prompt: ~6,800 (within 10,000 limit)

## 📞 Support

For questions or clarifications, refer to:
- `/spec/ux-specification.md` - Detailed UX specification
- `/spec/requirement.md` - Business requirements

