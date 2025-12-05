# Pages That Need New UI Update

## Summary
- **Total pages found**: 47 pages
- **Already updated with new UI**: 26 pages ✅
- **Still need updating**: 18 pages ❌
- **May need checking**: 3 pages ⚠️

---

## ❌ Pages Still Using Old UI (Need Updating)

### Authentication Pages (6 pages)
1. `(auth)/login/page.tsx` - Login page in auth group
2. `(auth)/register/page.tsx` - Register page in auth group  
3. `(auth)/reset-password/page.tsx` - Password reset request
4. `(auth)/reset-password/confirm/page.tsx` - Password reset confirmation
5. `(auth)/verify-otp/page.tsx` - OTP verification page
6. `(auth)/verify-otp/otp-form.tsx` - OTP form component

### User Management Pages (4 pages)
7. `profile/page.tsx` - User profile page
8. `people/[id]/page.tsx` - Individual person detail page
9. `people/[id]/edit/page.tsx` - Edit person page
10. `people/add/page.tsx` - Add new person page

### Reports Pages (5 pages)
11. `reports/page.tsx` - Reports listing page
12. `reports/[id]/page.tsx` - Individual report detail page
13. `reports/generate/page.tsx` - Generate report page
14. `reports/combine/page.tsx` - Combine reports page
15. `reports/bulk-generate/page.tsx` - Bulk generate reports page

### Other Pages (3 pages)
16. `templates/page.tsx` - Report templates page
17. `decisions/page.tsx` - Decisions/Co-pilot page
18. `test-multi-person/page.tsx` - Test page (may be removed)

---

## ⚠️ Pages That May Need Checking

These pages don't use glassmorphism components but may need UI updates:
1. `weekly-report/page.tsx` - Uses shadcn/ui components (Card, Button)
2. `yearly-report/page.tsx` - Uses shadcn/ui components (Card, Button)
3. `auth/google/callback/page.tsx` - OAuth callback (minimal UI)

---

## ✅ Pages Already Updated with New UI (26 pages)

### Core Features
- `dashboard/page.tsx`
- `settings/page.tsx`
- `ai-chat/page.tsx`
- `birth-chart/page.tsx`
- `daily-reading/page.tsx`
- `life-path/page.tsx`
- `compatibility/page.tsx`

### Numerology Tools
- `name-numerology/page.tsx`
- `phone-numerology/page.tsx`
- `business-name-numerology/page.tsx`
- `numerology-report/page.tsx`

### Features
- `remedies/page.tsx`
- `consultations/page.tsx`
- `people/page.tsx` (listing page)
- `user-analytics/page.tsx`

### Legal & Info Pages
- `privacy-policy/page.tsx`
- `terms-of-service/page.tsx`
- `cookie-policy/page.tsx`
- `disclaimer/page.tsx`
- `about/page.tsx`
- `contact/page.tsx`

### Content Pages
- `blog/page.tsx`
- `content-hub/page.tsx`
- `forum/page.tsx`

### Auth Pages (Root Level)
- `login/page.tsx` (root level - different from auth group)
- `register/page.tsx` (root level - different from auth group)
- `subscription/page.tsx`

---

## Update Priority

### High Priority (User-Facing Core Features)
1. `profile/page.tsx` - User profile management
2. `reports/page.tsx` - Reports listing
3. `reports/[id]/page.tsx` - Report details
4. `people/[id]/page.tsx` - Person details
5. `people/add/page.tsx` - Add person
6. `people/[id]/edit/page.tsx` - Edit person

### Medium Priority (Authentication Flow)
7. `(auth)/login/page.tsx`
8. `(auth)/register/page.tsx`
9. `(auth)/verify-otp/page.tsx`
10. `(auth)/reset-password/page.tsx`
11. `(auth)/reset-password/confirm/page.tsx`

### Lower Priority (Advanced Features)
12. `reports/generate/page.tsx`
13. `reports/combine/page.tsx`
14. `reports/bulk-generate/page.tsx`
15. `templates/page.tsx`
16. `decisions/page.tsx`
17. `test-multi-person/page.tsx` (consider removing)

---

## Quick Update Command

To update all remaining pages at once, you can run:

```bash
# Update imports from old to new UI components
find frontend/src/app -name "*.tsx" -type f -exec sed -i '' \
  's|@/components/glassmorphism/glass-card|@/components/ui/glass-card|g' {} \;

find frontend/src/app -name "*.tsx" -type f -exec sed -i '' \
  's|@/components/glassmorphism/glass-button|@/components/ui/glass-button|g' {} \;
```

Note: After running this, you may need to manually review and update:
- Component props if they differ between old and new components
- Any custom styling that was specific to old components
- Layout structures that may need adjustment

