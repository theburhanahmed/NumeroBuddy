# Database Models Audit

## Summary

- **No duplicate tables to remove.** Two similarly named models serve different purposes.
- **401/403/404 endpoint causes** are documented below; fixes applied in code.

---

## API Key Models (Not Duplicates)

| App            | Model   | Table                | Purpose |
|----------------|---------|----------------------|--------|
| accounts       | APIKey  | `api_keys`           | End-user API keys (e.g. mobile app auth). Used by `APIKeyAuthentication`. |
| developer_api  | APIKey  | `developer_api_keys` | Developer API keys with rate limits and usage tracking. |

**Recommendation:** Keep both. They represent different concepts (user keys vs developer keys).

---

## Profile-Related Models (Not Duplicates)

| Model               | Purpose |
|---------------------|--------|
| accounts.UserProfile | User account profile (name, DOB, preferences). |
| numerology.NumerologyProfile | Calculated numerology numbers (life path, destiny, etc.). |

One user has one UserProfile and one NumerologyProfile. They are linked by `NumerologyProfile.user` and `UserProfile.user`.

---

## Subscription / Billing

- **payments.Subscription** – Stripe-backed subscription; source of truth for plan and period.
- **accounts.User** – `subscription_plan`, `is_premium`, `premium_expiry` kept in sync for quick checks.

No duplication to remove; sync is intentional.

---

## Other Apps

- **reports**: ReportTemplate, GeneratedReport, ScheduledReport, ReportComparison – all used.
- **numerology**: Many feature-specific models (Remedy, Person, WeeklyReport, etc.) – all in use.
- **dashboard**, **analytics**, **feature_flags**, **consultations**, **meus**, etc. – no redundant tables identified.

---

## Endpoint Error Causes (Fixed)

| Error | Cause | Fix |
|-------|--------|-----|
| 500 on UserProfile save | Signal created NumerologyProfile with empty `defaults` → NOT NULL violation | Signal now passes full computed fields in `get_or_create` defaults. |
| 404 `/numerology/profile/` and dependent endpoints | No NumerologyProfile (creation had failed) | Lazy creation from UserProfile in profile view + `ensure_numerology_profile_from_user_profile()`. |
| 400 weekly-report | Numerology profile missing → generator raises ValueError | Same as above; profile is created on first profile request. |
| 404 `/reports/undefined/` | Frontend sent report id `undefined` | Guards in reports list and detail so we don’t call API or navigate with invalid id. |
| 401 users/profile, users/features | Expired or invalid JWT | Expected; client should refresh or re-login. |
| 403 generational, spiritual | Subscription tier or feature gate | Expected when user doesn’t have access. |
