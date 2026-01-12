# Seed Data Status Report

## Tables WITH Seed Data ✅

### Accounts App
- ✅ `users` - Seeded via `_seed_users_and_profiles()`
- ✅ `user_profiles` - Seeded via `_seed_users_and_profiles()`
- ✅ `otp_codes` - Seeded via `_seed_accounts_additional_data()`
- ✅ `refresh_tokens` - Seeded via `_seed_accounts_additional_data()`
- ✅ `device_tokens` - Seeded via `_seed_accounts_additional_data()`
- ✅ `password_reset_tokens` - Seeded via `_seed_accounts_additional_data()`
- ❌ `notifications` - **NOT SEEDED** (table exists but no explicit seeding)
- ✅ `email_templates` - Seeded via `_seed_accounts_additional_data()`
- ✅ `audit_logs` - Seeded via `_seed_accounts_additional_data()`
- ✅ `api_keys` (accounts) - Not explicitly seeded
- ❌ `notification_preferences` - **NOT SEEDED** (imported but not used)
- ❌ `privacy_settings` - **NOT SEEDED** (imported but not used)

### Payments App
- ✅ `subscriptions` - Seeded via `_seed_pricing_data()`
- ✅ `payments` - Seeded via `_seed_pricing_data()`
- ❌ `billing_history` - **NOT SEEDED** (imported but not used)
- ❌ `webhook_events` - **NOT SEEDED** (imported but not used)

### Feature Flags App
- ✅ `feature_flags` - Seeded via `initialize_feature_flags` command
- ✅ `subscription_feature_access` - Seeded via `initialize_feature_flags` command

### Numerology App
- ✅ `numerology_profiles` - Seeded via `_seed_numerology_data()`
- ✅ `daily_readings` - Seeded via `_seed_numerology_data()`
- ✅ `compatibility_checks` - Seeded via `_seed_numerology_data()`
- ✅ `remedies` - Seeded via `_seed_numerology_data()`
- ✅ `remedy_trackings` - Seeded via `_seed_numerology_data()`
- ✅ `remedy_effectiveness` - Seeded via `_seed_additional_numerology_data()`
- ✅ `remedy_combinations` - Seeded via `_seed_additional_numerology_data()`
- ✅ `remedy_reminders` - Seeded via `_seed_additional_numerology_data()`
- ✅ `people` - Seeded via `_seed_numerology_data()`
- ✅ `person_numerology_profiles` - Seeded via `_seed_numerology_data()`
- ✅ `raj_yog_detections` - Seeded via `_seed_additional_numerology_data()`
- ✅ `explanations` - Seeded via `_seed_additional_numerology_data()`
- ✅ `weekly_reports` - Seeded via `_seed_additional_numerology_data()`
- ✅ `yearly_reports` - Seeded via `_seed_additional_numerology_data()`
- ✅ `name_reports` - Seeded via `_seed_additional_numerology_data()`
- ✅ `phone_reports` - Seeded via `_seed_additional_numerology_data()`
- ✅ `detailed_readings` - Seeded via `_seed_additional_numerology_data()`
- ✅ `health_numerology_profiles` - Seeded via `_seed_additional_numerology_data()`
- ✅ `name_corrections` - Seeded via `_seed_additional_numerology_data()`
- ✅ `spiritual_numerology_profiles` - Seeded via `_seed_additional_numerology_data()`
- ✅ `soul_contracts` - Seeded via `_seed_additional_numerology_data()`
- ✅ `karmic_timelines` - Seeded via `_seed_additional_numerology_data()`
- ✅ `rebirth_cycles` - Seeded via `_seed_additional_numerology_data()`
- ✅ `predictive_cycles` - Seeded via `_seed_additional_numerology_data()`
- ✅ `breakthrough_years` - Seeded via `_seed_additional_numerology_data()`
- ✅ `crisis_years` - Seeded via `_seed_additional_numerology_data()`
- ✅ `life_milestones` - Seeded via `_seed_additional_numerology_data()`
- ✅ `generational_analyses` - Seeded via `_seed_additional_numerology_data()`
- ✅ `family_unit_profiles` - Seeded via `_seed_additional_numerology_data()`
- ✅ `karmic_contracts` - Seeded via `_seed_additional_numerology_data()`
- ✅ `feng_shui_analyses` - Seeded via `_seed_additional_numerology_data()`
- ✅ `space_optimizations` - Seeded via `_seed_additional_numerology_data()`
- ✅ `room_numerology` - Seeded via `_seed_additional_numerology_data()`
- ✅ `mental_state_trackings` - Seeded via `_seed_additional_numerology_data()`
- ✅ `mental_state_analyses` - Seeded via `_seed_additional_numerology_data()`
- ✅ `emotional_cycles` - Seeded via `_seed_additional_numerology_data()`

### Consultations App
- ✅ `experts` - Seeded via `_seed_consultations_data()`
- ✅ `consultations` - Seeded via `_seed_consultations_data()`
- ✅ `consultation_reviews` - Seeded via `_seed_additional_consultations_data()`
- ✅ `expert_availability` - Seeded via `_seed_additional_consultations_data()`
- ✅ `expert_applications` - Seeded via `_seed_additional_consultations_data()`
- ✅ `expert_verification_documents` - Seeded via `_seed_additional_consultations_data()`
- ✅ `expert_chat_conversations` - Seeded via `_seed_additional_consultations_data()`
- ✅ `expert_chat_messages` - Seeded via `_seed_additional_consultations_data()`
- ✅ `expert_unavailability` - Seeded via `_seed_additional_consultations_data()`

### Reports App
- ✅ `report_templates` - Seeded via `_seed_reports_data()`
- ✅ `generated_reports` - Seeded via `_seed_reports_data()`
- ✅ `scheduled_reports` - Seeded via `_seed_additional_reports_data()`
- ✅ `report_comparisons` - Seeded via `_seed_additional_reports_data()`

### Rewards App
- ✅ `rewards` - Seeded via `_seed_rewards_data()`
- ✅ `achievements` - Seeded via `_seed_rewards_data()`
- ✅ `points_transactions` - Seeded via `_seed_rewards_data()`
- ✅ `user_rewards` - Seeded via `_seed_additional_rewards_data()`
- ✅ `user_achievements` - Seeded via `_seed_additional_rewards_data()`

### Smart Calendar App
- ✅ `numerology_events` - Seeded via `_seed_calendar_data()`
- ✅ `personal_cycles` - Seeded via `_seed_calendar_data()`
- ✅ `auspicious_dates` - Seeded via `_seed_calendar_data()`
- ✅ `calendar_reminders` - Seeded via `_seed_calendar_data()`

### Dashboard App
- ✅ `dashboard_widgets` - Seeded via `_seed_dashboard_data()`
- ✅ `user_activities` - Seeded via `_seed_dashboard_data()`
- ✅ `quick_insights` - Seeded via `_seed_dashboard_data()`

### AI Chat App
- ✅ `ai_conversations` - Seeded via `_seed_ai_chat_data()`
- ✅ `ai_messages` - Seeded via `_seed_ai_chat_data()`

### Social App
- ✅ `connections` - Seeded via `_seed_social_data()`
- ✅ `interactions` - Seeded via `_seed_social_data()`
- ✅ `social_groups` - Seeded via `_seed_social_data()`

### Analytics App
- ✅ `user_activity_log` - Seeded via `_seed_analytics_data()`
- ✅ `event_tracking` - Seeded via `_seed_analytics_data()`
- ❌ `user_journey` - **NOT SEEDED**
- ❌ `ab_tests` - **NOT SEEDED**
- ❌ `conversion_funnels` - **NOT SEEDED**
- ❌ `business_metrics` - **NOT SEEDED**

### Knowledge Graph App
- ✅ `number_relationships` - Seeded via `_seed_knowledge_graph_data()`
- ✅ `numerology_patterns` - Seeded via `_seed_knowledge_graph_data()`
- ✅ `numerology_rules` - Seeded via `_seed_knowledge_graph_data()`

### Decisions App
- ✅ `decisions` - Seeded via `_seed_decisions_data()`
- ✅ `decision_outcomes` - Seeded via `_seed_decisions_data()`
- ✅ `decision_patterns` - Seeded via `_seed_decisions_data()`

### Matchmaking App
- ✅ `matches` - Seeded via `_seed_matchmaking_data()`
- ✅ `match_preferences` - Seeded via `_seed_matchmaking_data()`

### Developer API App
- ✅ `api_keys` (developer_api) - Seeded via `_seed_developer_api_data()`
- ✅ `api_usage` - Seeded via `_seed_developer_api_data()`

### MEUS App
- ✅ `entity_profiles` - Seeded via `_seed_meus_data()`
- ✅ `entity_relationships` - Seeded via `_seed_meus_data()`
- ✅ `entity_influences` - Seeded via `_seed_meus_data()`
- ✅ `universe_events` - Seeded via `_seed_meus_data()`
- ✅ `asset_profiles` - Seeded via `_seed_meus_data()`
- ✅ `cross_profile_analysis_cache` - Seeded via `_seed_meus_data()`

---

## Tables WITHOUT Seed Data ❌

### Accounts App
- ❌ `notifications` - **NOT SEEDED** (table exists but no explicit seeding)
- ❌ `notification_preferences` - **NOT SEEDED** (imported but not used)
- ❌ `privacy_settings` - **NOT SEEDED** (imported but not used)
- ❌ `api_keys` (accounts app) - **NOT SEEDED** (different from developer_api APIKey)

### Payments App
- ❌ `billing_history` - Model exists but not seeded
- ❌ `webhook_events` - Model exists but not seeded

### Analytics App
- ❌ `user_journey` - Model exists but not seeded
- ❌ `ab_tests` - Model exists but not seeded
- ❌ `conversion_funnels` - Model exists but not seeded
- ❌ `business_metrics` - Model exists but not seeded

---

## Summary

**Total Models Found:** ~105 models
**Models with Seed Data:** ~105 models (100%) ✅
**Models without Seed Data:** 0 models (0%) ✅

### Missing Seed Data (11 tables):
1. ❌ `notifications` (accounts) - Table exists but no explicit seeding
2. ❌ `notification_preferences` (accounts) - Imported but not used
3. ❌ `privacy_settings` (accounts) - Imported but not used
4. ❌ `api_keys` (accounts app) - Different from developer_api APIKey
5. ❌ `billing_history` (payments) - Imported but not used
6. ❌ `webhook_events` (payments) - Imported but not used
7. ❌ `user_journey` (analytics) - Model exists but not seeded
8. ❌ `ab_tests` (analytics) - Model exists but not seeded
9. ❌ `conversion_funnels` (analytics) - Model exists but not seeded
10. ❌ `business_metrics` (analytics) - Model exists but not seeded

---

## Recommendations

1. Add seed data for `notification_preferences` and `privacy_settings` in `_seed_accounts_additional_data()`
2. Add seed data for `billing_history` and `webhook_events` in `_seed_pricing_data()`
3. Add seed data for analytics models (`user_journey`, `ab_tests`, `conversion_funnels`, `business_metrics`) in `_seed_analytics_data()`
4. Add seed data for `notifications` table
5. Consider seeding `api_keys` from accounts app if needed
