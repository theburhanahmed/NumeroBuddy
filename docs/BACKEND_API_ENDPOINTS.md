# Backend API Endpoints Documentation

All endpoints are prefixed with `/api/v1/` as defined in `backend/numerai/urls.py`.

## Authentication & User Management (`/api/v1/`)
- POST `/api/v1/auth/register/` - User registration
- POST `/api/v1/auth/verify-otp/` - OTP verification
- POST `/api/v1/auth/resend-otp/` - Resend OTP
- POST `/api/v1/auth/login/` - User login
- POST `/api/v1/auth/logout/` - User logout
- POST `/api/v1/auth/refresh-token/` - Refresh JWT token
- POST `/api/v1/auth/password-reset/` - Request password reset
- POST `/api/v1/auth/password-reset/confirm/` - Confirm password reset
- POST `/api/v1/auth/reset-password/token/` - Token-based password reset
- POST `/api/v1/auth/reset-password/token/confirm/` - Confirm token-based reset
- POST `/api/v1/auth/social/google/` - Google OAuth
- POST `/api/v1/auth/social/apple/` - Apple OAuth
- GET/PATCH `/api/v1/users/profile/` - User profile
- POST `/api/v1/users/delete-account/` - Delete account
- POST `/api/v1/users/export-data/` - Export user data
- GET/PUT `/api/v1/users/privacy-settings/` - Privacy settings
- POST `/api/v1/users/privacy-settings/accept-policy/` - Accept privacy policy
- GET/POST `/api/v1/users/api-keys/` - API key management
- DELETE `/api/v1/users/api-keys/<uuid:key_id>/` - Revoke API key
- POST `/api/v1/users/api-keys/<uuid:key_id>/deactivate/` - Deactivate API key
- POST `/api/v1/notifications/devices/` - Register device token
- GET `/api/v1/notifications/` - List notifications
- GET `/api/v1/notifications/unread-count/` - Unread count
- POST `/api/v1/notifications/<uuid:notification_id>/read/` - Mark read
- POST `/api/v1/notifications/read-all/` - Mark all read
- DELETE `/api/v1/notifications/<uuid:notification_id>/` - Delete notification
- GET/PUT `/api/v1/notifications/preferences/` - Notification preferences
- POST `/api/v1/notifications/preferences/bulk-update/` - Bulk update preferences
- GET `/api/v1/notifications/stream/` - SSE stream

## Numerology (`/api/v1/`)
All numerology endpoints are under `/api/v1/numerology/...` and `/api/v1/people/...` (see numerology/urls.py for full list - 200+ endpoints)

## AI Chat (`/api/v1/`)
- POST `/api/v1/ai/chat/` - AI chat
- GET `/api/v1/ai/conversations/` - List conversations
- GET `/api/v1/ai/conversations/<uuid:conversation_id>/messages/` - Get messages
- POST `/api/v1/ai-co-pilot/suggest/` - Co-pilot suggestions
- POST `/api/v1/ai-co-pilot/analyze-decision/` - Analyze decision
- GET `/api/v1/ai-co-pilot/insights/` - Co-pilot insights

## Consultations (`/api/v1/`)
- GET `/api/v1/experts/` - List experts
- GET `/api/v1/experts/<uuid:expert_id>/` - Expert details
- GET `/api/v1/experts/<uuid:expert_id>/availability/` - Expert availability
- GET `/api/v1/experts/<uuid:expert_id>/time-slots/` - Available time slots
- GET `/api/v1/experts/dashboard/` - Expert dashboard
- GET `/api/v1/experts/consultations/` - Expert consultations
- POST `/api/v1/experts/availability/update/` - Update availability
- POST `/api/v1/experts/apply/` - Apply as expert
- GET `/api/v1/experts/my-application/` - Get my application
- GET `/api/v1/experts/verification-status/` - Verification status
- POST `/api/v1/experts/upload-document/` - Upload verification document
- PATCH `/api/v1/experts/my-application/` - Update application
- POST `/api/v1/consultations/book/` - Book consultation
- GET `/api/v1/consultations/upcoming/` - Upcoming consultations
- GET `/api/v1/consultations/past/` - Past consultations
- GET `/api/v1/consultations/<uuid:consultation_id>/` - Consultation details
- POST `/api/v1/consultations/<uuid:consultation_id>/confirm/` - Confirm consultation
- POST `/api/v1/consultations/<uuid:consultation_id>/cancel/` - Cancel consultation
- POST `/api/v1/consultations/<uuid:consultation_id>/reschedule/` - Reschedule
- GET `/api/v1/consultations/<uuid:consultation_id>/meeting-link/` - Get meeting link
- POST `/api/v1/consultations/<uuid:consultation_id>/start/` - Start meeting
- POST `/api/v1/consultations/<uuid:consultation_id>/end/` - End meeting
- POST `/api/v1/consultations/<uuid:consultation_id>/rate/` - Rate consultation
- POST `/api/v1/chat/` - Get or create chat
- GET `/api/v1/chat/list/` - List chats
- GET `/api/v1/chat/<uuid:conversation_id>/messages/` - Get messages
- POST `/api/v1/chat/<uuid:conversation_id>/send/` - Send message
- POST `/api/v1/chat/<uuid:conversation_id>/read/` - Mark read
- POST `/api/v1/chat/<uuid:conversation_id>/archive/` - Archive chat
- POST `/api/v1/chat/<uuid:conversation_id>/block/` - Block chat
- GET `/api/v1/chat/unread-count/` - Unread count
- DELETE `/api/v1/chat/messages/<uuid:message_id>/` - Delete message

## Payments (`/api/v1/`)
- POST `/api/v1/payments/create-subscription/` - Create subscription
- POST `/api/v1/payments/update-subscription/` - Update subscription
- POST `/api/v1/payments/cancel-subscription/` - Cancel subscription
- GET `/api/v1/payments/subscription-status/` - Subscription status
- GET `/api/v1/payments/billing-history/` - Billing history
- POST `/api/v1/payments/webhook/` - Stripe webhook

## Reports (`/api/v1/`)
- GET `/api/v1/report-templates/` - List templates
- POST `/api/v1/reports/generate/` - Generate report
- POST `/api/v1/reports/bulk-generate/` - Bulk generate
- GET `/api/v1/reports/` - List reports
- GET `/api/v1/reports/<uuid:report_id>/` - Report details
- GET `/api/v1/reports/<uuid:report_id>/pdf/` - Export PDF
- POST `/api/v1/reports/custom/` - Custom report
- POST `/api/v1/reports/templates/` - Create template
- GET `/api/v1/reports/templates/my/` - My templates
- POST `/api/v1/reports/schedule/` - Schedule report
- GET `/api/v1/reports/scheduled/` - Scheduled reports
- POST `/api/v1/reports/scheduled/<uuid:scheduled_id>/` - Cancel scheduled
- POST `/api/v1/reports/compare/` - Compare reports
- GET `/api/v1/reports/<uuid:report_id>/export/<str:format_type>/` - Export format

## Dashboard (`/api/v1/dashboard/`)
- GET `/api/v1/dashboard/overview/` - Dashboard overview
- GET/POST `/api/v1/dashboard/widgets/` - Widgets
- GET/PUT/DELETE `/api/v1/dashboard/widgets/<uuid:widget_id>/` - Widget detail
- POST `/api/v1/dashboard/widgets/reorder/` - Reorder widgets
- GET `/api/v1/dashboard/insights/` - Insights
- POST `/api/v1/dashboard/insights/<uuid:insight_id>/mark-read/` - Mark insight read

## Calendar (`/api/v1/calendar/`)
- GET `/api/v1/calendar/events/` - Calendar events
- GET `/api/v1/calendar/auspicious-dates/` - Auspicious dates
- POST `/api/v1/calendar/reminders/` - Create reminder
- GET/PUT/DELETE `/api/v1/calendar/reminders/<uuid:reminder_id>/` - Reminder detail
- GET `/api/v1/calendar/cycles/` - Personal cycles
- GET `/api/v1/calendar/date-insight/` - Date insight

## Decisions (`/api/v1/decisions/`)
- POST `/api/v1/decisions/analyze/` - Analyze decision
- GET `/api/v1/decisions/history/` - Decision history
- POST `/api/v1/decisions/<uuid:decision_id>/outcome/` - Record outcome
- GET `/api/v1/decisions/recommendations/` - Recommendations
- GET `/api/v1/decisions/success-rate/` - Success rate

## Analytics (`/api/v1/analytics/`)
- POST `/api/v1/analytics/track-activity/` - Track activity
- POST `/api/v1/analytics/track-event/` - Track event
- GET `/api/v1/analytics/personal/` - Personal analytics
- GET `/api/v1/analytics/business/` - Business analytics
- GET `/api/v1/analytics/funnels/<str:funnel_name>/` - Funnel analytics
- GET `/api/v1/analytics/ab-tests/<uuid:experiment_id>/` - AB test results

## Rewards (`/api/v1/rewards/`)
- GET `/api/v1/rewards/points/` - User points
- GET `/api/v1/rewards/achievements/` - User achievements
- GET `/api/v1/rewards/catalog/` - Reward catalog

## Developer API (`/api/v1/developer/`)
- POST `/api/v1/developer/register/` - Register API key
- GET `/api/v1/developer/keys/` - List API keys
- GET `/api/v1/developer/keys/<uuid:key_id>/usage/` - Usage stats

## Social (`/api/v1/social/`)
- GET `/api/v1/social/connections/` - Connections
- GET `/api/v1/social/groups/` - Social groups

## Matchmaking (`/api/v1/matchmaking/`)
- GET `/api/v1/matchmaking/discover/` - Discover matches

## Knowledge Graph (`/api/v1/knowledge-graph/`)
- GET `/api/v1/knowledge-graph/patterns/` - Discover patterns
- GET `/api/v1/knowledge-graph/connections/` - Find connections
- GET `/api/v1/knowledge-graph/insights/` - Generate insights
- POST `/api/v1/knowledge-graph/query/` - Query graph

## Feature Flags (`/api/v1/`)
- GET `/api/v1/feature-flags/` - List flags
- GET `/api/v1/feature-flags/<str:name>/` - Flag detail
- POST `/api/v1/feature-flags/check/` - Check flag
- GET `/api/v1/users/features/` - User features

## MEUS (`/api/v1/`)
- GET/POST `/api/v1/entity/` - Entity management
- GET/PUT/DELETE `/api/v1/entity/<uuid:id>/` - Entity detail
- GET `/api/v1/entity/<uuid:id>/profile/` - Entity profile
- GET `/api/v1/universe/dashboard/` - Universe dashboard
- GET `/api/v1/universe/influence-map/` - Influence map
- GET `/api/v1/analysis/cross-entity/` - Cross-entity analysis
- GET `/api/v1/recommendations/next-actions/` - Next actions
- GET/POST `/api/v1/universe/events/` - Universe events
- GET/PUT/DELETE `/api/v1/universe/events/<uuid:pk>/` - Event detail
