# Schema Overview

Concise reference of all Django apps and their models. For detailed schema narrative see [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md).

## accounts

| Model | Purpose |
|-------|---------|
| User | Custom user (email/phone auth); subscription_plan, is_premium, premium_expiry for quick reads |
| UserProfile | Extended profile: date_of_birth, gender, timezone, location, bio |
| OTPCode | Email/phone OTP verification |
| RefreshToken | JWT refresh tokens |
| DeviceToken | FCM/push device registration |
| EmailTemplate | Templated emails (OTP, reset, subscription) |
| PasswordResetToken | Password reset flow |
| Notification | In-app notifications |
| AuditLog | User action audit trail |
| APIKey | Developer API keys |
| NotificationPreference | Per-type, per-channel notification toggles |
| PrivacySettings | GDPR, visibility, data retention |

## payments

| Model | Purpose |
|-------|---------|
| Subscription | One per user; Stripe subscription; plan (basic/premium/elite), status, period; syncs to User |
| Payment | Stripe payment records |
| BillingHistory | Invoice/payment history for user and support |
| WebhookEvent | Stripe webhook idempotency and audit |

**Note:** Subscription can be created from Django admin (no Stripe) for testing; stripe_subscription_id nullable.

## numerology

See `numerology/models/_monolith.py` and [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md). Core: NumerologyProfile, DailyReading, CompatibilityCheck, Person, PersonNumerologyProfile, Remedy*, WeeklyReport, YearlyReport, NameReport, PhoneReport, DetailedReading; plus specialized (HealthNumerologyProfile, SpiritualNumerologyProfile, FengShuiAnalysis, PredictiveCycle, etc.).

## reports

| Model | Purpose |
|-------|---------|
| ReportTemplate | Template definitions for report generation |
| GeneratedReport | User-generated reports (JSON content) |
| ScheduledReport | Scheduled report jobs |
| ReportComparison | Compared reports |

## consultations

| Model | Purpose |
|-------|---------|
| Expert | Expert profiles and verification |
| Consultation | Booked sessions |
| ConsultationReview | User reviews |
| ExpertApplication, ExpertVerificationDocument | Expert onboarding |
| ExpertChatConversation, ExpertChatMessage | Chat with experts |
| ExpertAvailability, ExpertUnavailability | Booking slots |

## ai_chat

| Model | Purpose |
|-------|---------|
| AIConversation | Chat session container |
| AIMessage | Messages in a conversation |

## dashboard

| Model | Purpose |
|-------|---------|
| (see analytics for activity) | Dashboard uses analytics.UserActivityLog |

## analytics

| Model | Purpose |
|-------|---------|
| UserActivityLog | Single source for activity feed and analytics |

## feature_flags

| Model | Purpose |
|-------|---------|
| FeatureFlag | Feature toggles and naming |
| SubscriptionFeatureAccess | Per-tier access (free/basic/premium/elite) |

## meus

| Model | Purpose |
|-------|---------|
| EntityProfile | MEUS entity definition |
| EntityRelationship | Relationships between entities |

## social

| Model | Purpose |
|-------|---------|
| Connection | User-to-user connections (friend, follower, etc.) |
| Interaction | Compatibility shared, insight shared, etc. |
| SocialGroup | Numerology-based groups |

## decisions, matchmaking, rewards, developer_api, knowledge_graph, smart_calendar

See app `models.py` for current fields. Used by their respective API routes.

## Subscription and User sync

- **User** holds `subscription_plan`, `is_premium`, `premium_expiry` for fast reads and when no Stripe Subscription exists.
- **Subscription** (payments) is source of truth when present. Resolution: `numerology.subscription_utils.get_user_subscription_tier()` (prefers Subscription, else User.subscription_plan, else 'free').
- Admin: Changing User subscription_plan or Subscription plan/status syncs the other; User admin can create a Subscription when setting a paid plan if one does not exist.
