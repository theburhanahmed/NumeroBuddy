# Raj Yog Detection & Enhanced Reports Roadmap

## Overview

This roadmap outlines the implementation plan for Raj Yog detection, human-readable explanations, and richer daily/weekly/yearly reports for Numerobuddy. The feature will be delivered in 2 sprints with MVP focusing on Raj Yog detection and daily reports, followed by weekly/yearly reports and enhanced explanations.

**Tech Stack:**
- Backend: Python (Django), FastAPI endpoints, Postgres DB, SQLAlchemy/Django ORM
- Background Jobs: Celery, Redis
- Frontend: React + Next.js, Tailwind CSS
- ML/LLM: OpenAI/Anthropic API for explanations, embeddings (Postgres + pgvector or Pinecone)

**Timeline:** 2 Sprints
- **Sprint 1 (MVP):** Raj Yog detection + Enhanced daily reports
- **Sprint 2:** Weekly/Yearly reports + Richer explanations

---

## Epic 1: Raj Yog Detection Engine

### Description
Build a comprehensive Raj Yog detection system that identifies auspicious number combinations in a user's numerology profile. Raj Yog indicates success, leadership, prosperity, and spiritual growth.

### Acceptance Criteria
- [ ] Detect all major Raj Yog combinations (1-8, 1-9, 2-7, 3-6, 4-5, master number combinations)
- [ ] Support detection across multiple numerology systems (Pythagorean, Chaldean, Vedic)
- [ ] Calculate Raj Yog strength/score (0-100)
- [ ] Store detection results in database with metadata
- [ ] API endpoint returns Raj Yog status with details
- [ ] Unit tests with 95%+ coverage
- [ ] Performance: detection completes in <100ms

### Wireframe Notes
- **Detection Results Display:**
  - Badge/indicator showing "Raj Yog Detected" or "No Raj Yog"
  - List of detected combinations with names (e.g., "Leadership Raj Yog", "Spiritual Raj Yog")
  - Strength meter/percentage
  - Breakdown showing which numbers contributed to the detection
  - Visual representation (cards or grid) showing number combinations

### Key Files to Change
- `backend/numerology/numerology.py` - Add `detect_raj_yog()` method
- `backend/numerology/models.py` - Add `RajYogDetection` model
- `backend/numerology/serializers.py` - Add `RajYogDetectionSerializer`
- `backend/numerology/views.py` - Add `get_raj_yog_detection` endpoint
- `backend/numerology/urls.py` - Add route for Raj Yog endpoint
- `backend/numerology/tests/test_raj_yog.py` - New test file
- `frontend/src/lib/numerology-api.ts` - Add API client method
- `frontend/src/types/numerology.ts` - Add Raj Yog types

---

## Epic 2: LLM-Powered Human-Readable Explanations

### Description
Generate natural, personalized explanations for Raj Yog detections and numerology insights using LLM APIs (OpenAI/Anthropic). Store embeddings for semantic search and future RAG enhancements.

### Acceptance Criteria
- [ ] LLM service abstraction supporting OpenAI and Anthropic
- [ ] Generate explanations for Raj Yog combinations (200-500 words)
- [ ] Generate personalized daily/weekly/yearly insights
- [ ] Store generated explanations in database
- [ ] Cache explanations to reduce API calls (Redis)
- [ ] Embedding generation and storage (pgvector or Pinecone)
- [ ] Fallback to template-based explanations if LLM fails
- [ ] Rate limiting and error handling
- [ ] Cost tracking per user/request

### Wireframe Notes
- **Explanation Display:**
  - Rich text explanation section with formatting
  - "Regenerate" button for custom explanations
  - Loading state with skeleton
  - Error state with retry option
  - Character count indicator
  - "Read more/less" for long explanations

### Key Files to Change
- `backend/numerology/services/llm_service.py` - New LLM abstraction service
- `backend/numerology/services/explanation_generator.py` - New explanation generator
- `backend/numerology/models.py` - Add `Explanation` model
- `backend/numerology/serializers.py` - Add `ExplanationSerializer`
- `backend/numerology/views.py` - Add explanation endpoints
- `backend/numerology/tasks.py` - Add async explanation generation task
- `backend/numerai/settings/base.py` - Add LLM API keys configuration
- `frontend/src/components/numerology/explanation-card.tsx` - New component
- `frontend/src/lib/numerology-api.ts` - Add explanation API methods

---

## Epic 3: Enhanced Daily Reports

### Description
Enhance existing daily reports with Raj Yog insights, LLM-generated explanations, and richer content including personalized recommendations, auspicious timings, and actionable insights.

### Acceptance Criteria
- [ ] Daily reports include Raj Yog status and insights
- [ ] LLM-generated personalized daily guidance (100-200 words)
- [ ] Enhanced lucky numbers, colors, and timings with explanations
- [ ] Actionable recommendations based on Raj Yog and numerology
- [ ] Visual indicators for auspicious vs. challenging days
- [ ] Share/export functionality for daily reports
- [ ] Historical daily reports accessible via API
- [ ] Push notifications for daily reports (optional)

### Wireframe Notes
- **Daily Report Page:**
  - Header with date and personal day number
  - Raj Yog badge/indicator prominently displayed
  - Card layout: Lucky Numbers, Colors, Times, Activities
  - Main explanation section with expandable details
  - Action items checklist
  - Warnings/cautions section
  - Navigation to previous/next day
  - Share button (social media, email, PDF)

### Key Files to Change
- `backend/numerology/reading_generator.py` - Enhance `generate_personalized_reading()`
- `backend/numerology/models.py` - Enhance `DailyReading` model
- `backend/numerology/serializers.py` - Update `DailyReadingSerializer`
- `backend/numerology/views.py` - Enhance daily reading endpoints
- `backend/numerology/tasks.py` - Update `generate_daily_readings()` task
- `frontend/src/app/daily-reading/page.tsx` - Enhance UI
- `frontend/src/components/numerology/reading-card.tsx` - Update component
- `frontend/src/components/numerology/raj-yog-badge.tsx` - New component

---

## Epic 4: Weekly Reports

### Description
Generate comprehensive weekly numerology reports that aggregate daily insights, highlight weekly trends, and provide guidance for the upcoming week.

### Acceptance Criteria
- [ ] Weekly report generation for all active users
- [ ] Aggregate daily insights into weekly summary
- [ ] Weekly numerology number calculation
- [ ] Raj Yog status for the week
- [ ] Weekly themes and patterns identification
- [ ] Recommendations for the week ahead
- [ ] Celery task for batch weekly report generation
- [ ] API endpoint to fetch weekly reports
- [ ] Weekly report storage in database

### Wireframe Notes
- **Weekly Report Page:**
  - Week selector (calendar picker)
  - Weekly overview card with main theme
  - Day-by-day breakdown (7 cards in grid)
  - Weekly numerology number and interpretation
  - Raj Yog status for the week
  - Weekly summary section
  - Trends visualization (charts/graphs)
  - Download as PDF option

### Key Files to Change
- `backend/numerology/models.py` - Add `WeeklyReport` model
- `backend/numerology/services/weekly_report_generator.py` - New service
- `backend/numerology/serializers.py` - Add `WeeklyReportSerializer`
- `backend/numerology/views.py` - Add weekly report endpoints
- `backend/numerology/tasks.py` - Add `generate_weekly_reports()` task
- `backend/numerai/settings/base.py` - Add weekly report schedule
- `frontend/src/app/weekly-report/page.tsx` - New page
- `frontend/src/components/numerology/weekly-report-card.tsx` - New component
- `frontend/src/lib/numerology-api.ts` - Add weekly report API methods

---

## Epic 5: Yearly Reports

### Description
Generate comprehensive yearly numerology reports providing annual insights, major trends, and guidance for the year ahead based on personal year number and Raj Yog patterns.

### Acceptance Criteria
- [ ] Yearly report generation for all active users
- [ ] Personal year number calculation and interpretation
- [ ] Annual Raj Yog analysis
- [ ] Month-by-month overview with key dates
- [ ] Major themes and opportunities for the year
- [ ] Challenges and remedies for the year
- [ ] Celery task for batch yearly report generation (runs annually)
- [ ] API endpoint to fetch yearly reports
- [ ] Yearly report storage in database

### Wireframe Notes
- **Yearly Report Page:**
  - Year selector dropdown
  - Annual overview section with personal year number
  - Raj Yog status for the year
  - Month-by-month calendar view
  - Key dates and periods highlighted
  - Major themes section
  - Opportunities and challenges cards
  - Download full report as PDF
  - Share functionality

### Key Files to Change
- `backend/numerology/models.py` - Add `YearlyReport` model
- `backend/numerology/services/yearly_report_generator.py` - New service
- `backend/numerology/serializers.py` - Add `YearlyReportSerializer`
- `backend/numerology/views.py` - Add yearly report endpoints
- `backend/numerology/tasks.py` - Add `generate_yearly_reports()` task
- `backend/numerai/settings/base.py` - Add yearly report schedule
- `frontend/src/app/yearly-report/page.tsx` - New page
- `frontend/src/components/numerology/yearly-report-card.tsx` - New component
- `frontend/src/lib/numerology-api.ts` - Add yearly report API methods

---

## Epic 6: Database Schema & Migrations

### Description
Create database models and migrations for Raj Yog detection, explanations, and enhanced reports (weekly/yearly).

### Acceptance Criteria
- [ ] `RajYogDetection` model with proper indexes
- [ ] `Explanation` model with LLM metadata
- [ ] `WeeklyReport` model with JSON fields for flexibility
- [ ] `YearlyReport` model with JSON fields
- [ ] Enhanced `DailyReading` model with new fields
- [ ] Database indexes for performance
- [ ] Migration files for all models
- [ ] Data migration for existing users (backfill)
- [ ] Rollback migration scripts

### Wireframe Notes
- N/A (Database schema)

### Key Files to Change
- `backend/numerology/models.py` - Add new models
- `backend/numerology/migrations/XXXX_add_raj_yog_detection.py` - New migration
- `backend/numerology/migrations/XXXX_add_explanations.py` - New migration
- `backend/numerology/migrations/XXXX_add_weekly_reports.py` - New migration
- `backend/numerology/migrations/XXXX_add_yearly_reports.py` - New migration
- `backend/numerology/migrations/XXXX_enhance_daily_readings.py` - New migration
- `docs/architecture/database_schema.sql` - Update schema documentation

---

## Epic 7: Batch Job Generation & Scheduling

### Description
Implement Celery tasks for batch generation of daily, weekly, and yearly reports with proper scheduling, error handling, and monitoring.

### Acceptance Criteria
- [ ] Daily report generation task (runs daily at 7 AM)
- [ ] Weekly report generation task (runs weekly on Sunday)
- [ ] Yearly report generation task (runs annually on Jan 1)
- [ ] Batch processing with chunking for large user bases
- [ ] Retry logic with exponential backoff
- [ ] Task progress tracking
- [ ] Error logging and alerting
- [ ] Task prioritization (premium users first)
- [ ] Rate limiting for LLM API calls

### Wireframe Notes
- **Admin Dashboard (for monitoring):**
  - Task status dashboard
  - Success/failure rates
  - Queue length indicators
  - Manual trigger buttons
  - Task logs viewer

### Key Files to Change
- `backend/numerology/tasks.py` - Add batch generation tasks
- `backend/numerai/celery.py` - Update beat schedule
- `backend/numerai/settings/base.py` - Update Celery configuration
- `backend/numerology/services/batch_processor.py` - New batch processing service
- `backend/analytics/services/task_monitoring.py` - Add task monitoring (if exists)

---

## Epic 8: Frontend UI/UX Enhancements

### Description
Build React components and pages for displaying Raj Yog detection, enhanced reports, and improved user experience with modern UI patterns.

### Acceptance Criteria
- [ ] Raj Yog badge component with animations
- [ ] Enhanced daily reading page with new sections
- [ ] Weekly report page with calendar integration
- [ ] Yearly report page with month view
- [ ] Explanation cards with expand/collapse
- [ ] Loading states and skeletons
- [ ] Error handling and retry UI
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark mode support
- [ ] Accessibility (WCAG 2.1 AA)

### Wireframe Notes
- **Dashboard Integration:**
  - Raj Yog widget on main dashboard
  - Quick access to daily/weekly/yearly reports
  - Report history sidebar
  - Notification badges for new reports

- **Report Pages:**
  - Consistent header with navigation
  - Sticky table of contents for long reports
  - Print-friendly styles
  - Social sharing buttons
  - Export options (PDF, JSON)

### Key Files to Change
- `frontend/src/components/numerology/raj-yog-badge.tsx` - New component
- `frontend/src/components/numerology/explanation-card.tsx` - New component
- `frontend/src/components/numerology/weekly-report-card.tsx` - New component
- `frontend/src/components/numerology/yearly-report-card.tsx` - New component
- `frontend/src/app/daily-reading/page.tsx` - Enhance existing
- `frontend/src/app/weekly-report/page.tsx` - New page
- `frontend/src/app/yearly-report/page.tsx` - New page
- `frontend/src/app/dashboard/page.tsx` - Add Raj Yog widget
- `frontend/src/lib/numerology-api.ts` - Add API methods
- `frontend/src/types/numerology.ts` - Add type definitions

---

## Epic 9: QA & Testing

### Description
Comprehensive testing strategy including unit tests, integration tests, E2E tests, and performance testing.

### Acceptance Criteria
- [ ] Unit tests for Raj Yog detection (95%+ coverage)
- [ ] Unit tests for LLM service (mocked)
- [ ] Unit tests for report generators
- [ ] Integration tests for API endpoints
- [ ] E2E tests for report generation flow
- [ ] Performance tests for batch jobs
- [ ] Load testing for API endpoints
- [ ] LLM API failure scenarios testing
- [ ] Database migration testing
- [ ] Cross-browser testing (Chrome, Firefox, Safari)

### Wireframe Notes
- N/A (Testing)

### Key Files to Change
- `backend/numerology/tests/test_raj_yog.py` - New test file
- `backend/numerology/tests/test_explanations.py` - New test file
- `backend/numerology/tests/test_weekly_reports.py` - New test file
- `backend/numerology/tests/test_yearly_reports.py` - New test file
- `backend/numerology/tests/test_batch_jobs.py` - New test file
- `frontend/src/__tests__/components/raj-yog-badge.test.tsx` - New test
- `frontend/src/__tests__/components/explanation-card.test.tsx` - New test
- `frontend/e2e/reports.spec.ts` - New E2E test
- `docs/qa/test_plan.md` - New test plan document

---

## Epic 10: Monitoring & Observability

### Description
Implement monitoring, logging, and alerting for Raj Yog detection, report generation, and LLM API usage.

### Acceptance Criteria
- [ ] Logging for Raj Yog detection (success/failure)
- [ ] LLM API usage tracking (tokens, cost, latency)
- [ ] Report generation metrics (success rate, duration)
- [ ] Error tracking and alerting (Sentry or similar)
- [ ] Performance monitoring (response times)
- [ ] Database query performance monitoring
- [ ] Celery task monitoring dashboard
- [ ] User engagement metrics (report views, shares)
- [ ] Cost tracking per feature

### Wireframe Notes
- **Admin Monitoring Dashboard:**
  - Real-time metrics dashboard
  - LLM API usage charts
  - Error rate graphs
  - Task queue status
  - Cost breakdown by feature
  - User engagement analytics

### Key Files to Change
- `backend/numerology/services/monitoring.py` - New monitoring service
- `backend/numerology/middleware/metrics_middleware.py` - New middleware
- `backend/analytics/models.py` - Add metrics models (if exists)
- `backend/analytics/services/metrics_collector.py` - Add metrics collection
- `docs/monitoring/setup.md` - New monitoring setup guide

---

## Sprint Breakdown

### Sprint 1: MVP (Raj Yog Detection + Enhanced Daily Reports)

**Duration:** 2 weeks

**Epics:**
1. Epic 1: Raj Yog Detection Engine
2. Epic 2: LLM-Powered Explanations (basic)
3. Epic 3: Enhanced Daily Reports
4. Epic 6: Database Schema (Raj Yog + Daily enhancements)
5. Epic 8: Frontend UI (Daily reports + Raj Yog badge)
6. Epic 9: QA (Unit + Integration tests)
7. Epic 10: Basic Monitoring

**Deliverables:**
- Raj Yog detection working for all users
- Enhanced daily reports with Raj Yog insights
- LLM-generated explanations for daily reports
- Frontend UI for viewing enhanced daily reports
- Basic monitoring and logging

**Success Metrics:**
- Raj Yog detection accuracy: 100% (validated against known combinations)
- Daily report generation: <5s per user
- LLM explanation generation: <10s per report
- API response time: <500ms (p95)

---

### Sprint 2: Weekly/Yearly Reports + Richer Explanations

**Duration:** 2 weeks

**Epics:**
1. Epic 4: Weekly Reports
2. Epic 5: Yearly Reports
3. Epic 2: Enhanced LLM Explanations (richer, more personalized)
4. Epic 7: Batch Job Generation & Scheduling
5. Epic 6: Database Schema (Weekly/Yearly)
6. Epic 8: Frontend UI (Weekly/Yearly pages)
7. Epic 9: QA (E2E + Performance tests)
8. Epic 10: Enhanced Monitoring

**Deliverables:**
- Weekly report generation and UI
- Yearly report generation and UI
- Enhanced explanations with more context
- Batch job scheduling for all report types
- Complete monitoring dashboard
- Full test coverage

**Success Metrics:**
- Weekly report generation: <30s per user
- Yearly report generation: <2min per user
- Batch job success rate: >99%
- User engagement: 40%+ users view reports weekly

---

## Priority Matrix

### P0 (Critical - Sprint 1)
- Raj Yog detection algorithm
- Enhanced daily reports
- Basic LLM explanations
- Database models for Raj Yog
- Daily report frontend

### P1 (High - Sprint 1)
- LLM service abstraction
- Explanation caching
- Daily report API endpoints
- Basic monitoring

### P2 (Medium - Sprint 2)
- Weekly reports
- Yearly reports
- Batch job scheduling
- Enhanced explanations

### P3 (Low - Post-Sprint 2)
- Advanced analytics
- Report sharing/export
- Custom report templates
- Multi-language support

---

## Dependencies

### External Dependencies
- OpenAI/Anthropic API access and keys
- pgvector extension for Postgres (if using Postgres for embeddings)
- OR Pinecone account (if using Pinecone)
- Redis for caching and Celery

### Internal Dependencies
- Existing numerology calculation engine
- User authentication system
- Database migration system
- Celery worker infrastructure
- Frontend component library

---

## Risk Mitigation

### Risks
1. **LLM API Costs:** High usage could be expensive
   - *Mitigation:* Implement caching, rate limiting, and cost tracking
   
2. **LLM API Reliability:** External API failures
   - *Mitigation:* Fallback to template-based explanations, retry logic
   
3. **Performance:** Batch jobs taking too long
   - *Mitigation:* Chunking, parallel processing, optimization
   
4. **Data Migration:** Existing user data migration complexity
   - *Mitigation:* Phased rollout, data validation, rollback plan

---

## Success Criteria

### Technical
- [ ] All tests passing (95%+ coverage)
- [ ] API response times <500ms (p95)
- [ ] Batch jobs complete within SLA
- [ ] Zero critical bugs in production
- [ ] Monitoring and alerting functional

### Business
- [ ] Raj Yog detection available for all users
- [ ] Enhanced daily reports with 80%+ user satisfaction
- [ ] Weekly/yearly reports generating successfully
- [ ] LLM explanations generating without errors
- [ ] Cost per user within budget

---

## Notes

- Raj Yog combinations to detect:
  - Leadership Raj Yog: Life Path 1 + Destiny 8
  - Spiritual Raj Yog: Life Path 7 + Destiny 9
  - Material Raj Yog: Life Path 8 + Destiny 1
  - Creative Raj Yog: Life Path 3 + Destiny 6
  - Service Raj Yog: Life Path 6 + Destiny 3
  - Master Number Raj Yog: Any combination with 11, 22, or 33
  - And other traditional combinations

- LLM Prompt Engineering:
  - Use few-shot examples for consistent formatting
  - Include user context (life path, destiny, etc.)
  - Generate explanations in user's preferred language
  - Maintain tone: warm, encouraging, practical

- Performance Targets:
  - Raj Yog detection: <100ms
  - LLM explanation: <10s (with caching)
  - Daily report generation: <5s
  - Weekly report generation: <30s
  - Yearly report generation: <2min

---

## Appendix: File Structure Reference

```
backend/
├── numerology/
│   ├── models.py (RajYogDetection, Explanation, WeeklyReport, YearlyReport)
│   ├── numerology.py (detect_raj_yog method)
│   ├── services/
│   │   ├── llm_service.py
│   │   ├── explanation_generator.py
│   │   ├── weekly_report_generator.py
│   │   ├── yearly_report_generator.py
│   │   └── batch_processor.py
│   ├── serializers.py (new serializers)
│   ├── views.py (new endpoints)
│   ├── tasks.py (batch generation tasks)
│   └── tests/
│       ├── test_raj_yog.py
│       ├── test_explanations.py
│       ├── test_weekly_reports.py
│       └── test_yearly_reports.py
└── numerai/
    └── celery.py (updated schedule)

frontend/
├── src/
│   ├── app/
│   │   ├── daily-reading/page.tsx (enhanced)
│   │   ├── weekly-report/page.tsx (new)
│   │   └── yearly-report/page.tsx (new)
│   ├── components/
│   │   └── numerology/
│   │       ├── raj-yog-badge.tsx (new)
│   │       ├── explanation-card.tsx (new)
│   │       ├── weekly-report-card.tsx (new)
│   │       └── yearly-report-card.tsx (new)
│   └── lib/
│       └── numerology-api.ts (enhanced)
```

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-XX  
**Owner:** Development Team  
**Status:** Ready for Sprint Planning

