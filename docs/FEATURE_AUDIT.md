# Feature Audit Checklist

This document tracks verification of every user-facing feature, API route, and UI behavior. Update pass/fail and notes as issues are fixed.

## Auth & Profile

| Feature | API / Route | Frontend | Status | Notes |
|---------|-------------|----------|--------|-------|
| Login | POST `/api/v1/auth/login/` | `/login` | Pass | |
| Register | POST `/api/v1/auth/register/` | `/register` | Pass | |
| OTP verify | POST `/api/v1/auth/verify-otp/` | verify-otp | Pass | |
| Reset password | token flow `/api/v1/auth/reset-password/token/` | reset-password | Pass | |
| Profile GET | GET `/api/v1/users/profile/` | profile, settings | Pass | |
| Profile UPDATE | PATCH `/api/v1/users/profile/` | settings | Pass | Fixed: settings save calls API |
| Notification preferences | GET/POST `/api/v1/notifications/preferences/`, bulk-update | settings | Pass | Fixed: settings calls bulk-update |
| Logout | POST `/api/v1/auth/logout/` | nav | Pass | |

## Numerology

| Feature | API / Route | Frontend | Status | Notes |
|---------|-------------|----------|--------|-------|
| Life Path | numerology API | `/life-path` | Pass | |
| Birth Chart | numerology API | `/birth-chart` | Pass | |
| Daily Reading | numerology API | `/daily-reading` | Pass | |
| Compatibility | numerology API | `/compatibility` | Pass | |
| Name numerology | name preview API | `/name-numerology` | Pass | |
| Phone numerology | phone preview API | `/phone-numerology` | Pass | |
| Business name | business API | `/business-name-numerology` | Pass | |
| Lo Shu Grid | Lo Shu API | `/lo-shu-grid` | Pass | 403 + upgrade toast |
| Pinnacles | numerology | `/my-numerology/pinnacles` | Pass | |
| Karmic | numerology | `/my-numerology/karmic` | Pass | |
| All Numbers | numerology | `/my-numerology/all-numbers` | Pass | |
| Generational | numerology | `/generational-numerology` | Pass | |
| Reports list/generate | reports API | `/reports`, generate, combine, bulk | Pass | |

## People & Reports

| Feature | API / Route | Frontend | Status | Notes |
|---------|-------------|----------|--------|-------|
| People list | people API | `/people` | Pass | |
| Person detail | people API | `/people/[id]` | Pass | |
| Calculate person numerology | people API | person detail | Pass | |
| Generate report | reports API | reports/generate | Pass | |
| PDF export | - | NameNumerologyReport | Partial | Button present; optional jsPDF/backend |

## Consultations

| Feature | API / Route | Frontend | Status | Notes |
|---------|-------------|----------|--------|-------|
| List / book | consultations API | `/consultations`, book | Pass | |
| My consultations | consultations API | `/consultations/my-consultations` | Pass | |
| Chat / video | consultations API | chat, video routes | Pass | |

## Tools & Timing

| Feature | API / Route | Frontend | Status | Notes |
|---------|-------------|----------|--------|-------|
| Tools hub | - | `/tools` | Pass | Links to name, phone, business, assets |
| Timing cycles | calendar/numerology | `/timing-cycles`, `/timing-cycles/personal` | Pass | |
| Auspicious dates | calendar API | `/auspicious-dates` | Pass | |
| Forecasts | numerology | `/forecasts` | Pass | |
| Decisions | decisions API | `/decisions` | Pass | |
| Remedies | remedy API | `/remedies` | Pass | |

## AI

| Feature | API / Route | Frontend | Status | Notes |
|---------|-------------|----------|--------|-------|
| AI Chat | ai_chat API | Chat (context), `/ai-chat` | Pass | Subscription gating on backend |
| AI Numerologist | same | `/ai-numerologist` | Pass | |

## Subscription & Payments

| Feature | API / Route | Frontend | Status | Notes |
|---------|-------------|----------|--------|-------|
| Subscription page | - | `/subscription` | Pass | |
| Checkout | POST `/api/v1/payments/create-subscription/` | `/subscription/checkout` | Partial | Stripe Elements TODO; flow works with backend |
| Success | - | `/subscription/success` | Pass | |
| Status | GET subscription-status | dashboard/settings | Pass | |

## Other

| Feature | API / Route | Frontend | Status | Notes |
|---------|-------------|----------|--------|-------|
| MEUS dashboard | meus API | `/meus/dashboard` | Pass | |
| MEUS entities | meus API | `/meus/entities` | Pass | |
| Rewards | GET `/api/v1/rewards/*` | dashboard, `/rewards` if exists | Pass | |
| Forum | - | `/forum` | Route only | Backend TBD |
| Content hub | - | `/content-hub` | Route only | |
| User analytics | analytics API | `/user-analytics` | Pass | |
| Social connections | GET/POST `/api/v1/social/` | - | Partial | POST returns 501; GET returns data |

## Navbar & Navigation

| Item | Status | Notes |
|------|--------|-------|
| Single nav config | Done | `frontend/src/config/navigation.ts` |
| CosmicNavbar uses config | Done | |
| Mobile bottom nav uses config | Done | |
| Mobile more sheet uses config | Done | |
| Landing nav | Done | Unchanged; Pricing → /subscription |
| Unused components | Done | GlassNav, ui/header unused; left in codebase, not in use |

## Django Admin

| Item | Status | Notes |
|------|--------|-------|
| User: subscription tier toggle | Done | get_or_create Subscription when setting paid plan |
| User: Set to Free/ Basic/ Premium/ Elite actions | Done | Sync to Subscription |
| Payments: Set to Free action | Done | Sync to User |
| Subscription list/edit | Done | Already present |

## Production Readiness

| Item | Status | Notes |
|------|--------|-------|
| Health endpoint | Done | `/api/v1/health/` |
| Env checklist | Done | .env.example, PRODUCTION_CONFIGURATION_CHECKLIST |
| Secure cookies (production) | Done | In production.py |
| Schema doc | Done | docs/SCHEMA.md updated |
