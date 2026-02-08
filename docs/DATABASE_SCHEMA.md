# Database Schema (Post-Redesign)

This document describes the backend database schema after the consolidation and redesign.

## Activity tracking (single source)

- **Table:** `user_activity_log` (analytics app)
- **Model:** `analytics.models.UserActivityLog`
- **Purpose:** Single source for both dashboard activity feed and analytics. Fields: `user`, `activity_type`, `activity_data` (metadata), `created_at`, plus optional `session_id`, `ip_address`, `user_agent`, `page_path`, `feature_name`.
- **Deprecated:** `dashboard.UserActivity` and table `user_activities` have been removed; data was migrated into `user_activity_log`.

## Reports: two systems

### Template reports (reports app)

- **Tables:** `report_templates`, `generated_reports`, `scheduled_reports`, `report_comparisons`
- **Models:** `ReportTemplate`, `GeneratedReport`, `ScheduledReport`, `ReportComparison`
- **Purpose:** Template-based reports for a Person; content stored as JSON. Used by `/reports` UI (generate, list, compare, schedule).
- **Note:** Use `generated_at` and `template.report_type` (not `created_at` / `report_type` on the report).

### Numerology reports (numerology app)

- **Tables:** `weekly_reports`, `yearly_reports`, `name_reports`, `phone_reports`, `detailed_readings`
- **Models:** `WeeklyReport`, `YearlyReport`, `NameReport`, `PhoneReport`, `DetailedReading`
- **Purpose:** Feature-specific report schemas used by numerology endpoints and flows.

### Unified report listing

- **Endpoint:** `GET /api/v1/reports/reports/unified/`
- **Purpose:** Returns a single list of report-like items from both systems with `source` (`template` | `numerology`) and `report_type` for the frontend.

## Deprecated / low-use tables (kept for historical data)

- **RemedyEffectiveness** – Use `RemedyTracking.effectiveness_rating` instead; no new writes in services.
- **RemedyCombination** – Combination logic is in-memory in `RemediesService.get_remedy_combinations`.
- **EmotionalCycle** – No active feature uses it.
- **FamilyUnitProfile** – Use `GenerationalAnalysis` for family unit analysis.

## Predictive cycles (consolidated)

- **Table:** `predictive_cycles` (numerology app)
- **Model:** `PredictiveCycle` with `cycle_type`: `nine_year`, `breakthrough`, `crisis`, `opportunity`.
- **Purpose:** Breakthrough and crisis year data are stored here (type-specific data in `cycle_data` JSON and optional `confidence_score` / `severity_level`).
- **Removed:** `BreakthroughYear` and `CrisisYear` tables; data migrated into `predictive_cycles`.

## Numerology models layout

- **Package:** `numerology.models` (directory with `__init__.py`).
- **Current layout:** All model classes live in `numerology/models/_monolith.py` and are re-exported from `numerology/models/__init__.py` so existing `from numerology.models import ...` continue to work.
- **Future:** `_monolith.py` can be split into submodules (e.g. `core`, `readings`, `reports`, `remedies`, `spiritual`, `predictive`, `feng_shui`, `mental_state`, etc.) with the same `__init__.py` re-exports.

## Optional / feature apps (audit recommended)

- **social** – Connections, interactions, groups; only seeded in `seed_data`; has URL routes.
- **matchmaking** – Match, MatchPreference; only seeded; has URL routes.
- **rewards** – Reward, UserReward, Achievement, UserAchievement, PointsTransaction; only seeded; has URL routes.
- **meus** – EntityProfile, EntityRelationship, etc.; used by meus services and seed_data; has URL routes.

Recommendation: Confirm with product whether these are shipped or planned. If not in use, consider removing from main URL config or guarding behind feature flags, and stopping or isolating their seed data. See `docs/OPTIONAL_APPS_AUDIT.md`.
