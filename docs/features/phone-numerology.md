# Phone Number Numerology Feature

## Overview

The Phone Number Numerology feature allows users to compute numerological values from their phone numbers, including core numbers, destiny/vibration patterns, soul/outer patterns, and positional influences. The feature handles international formats (E.164), sanitizes and validates inputs, produces machine-readable payloads and human-friendly LLM explanations, supports client-side preview and queued server-side reports, and treats phone numbers as PII with configurable persistence.

## Architecture

### Backend Components

1. **Model**: `PhoneReport` - Stores persisted phone numerology reports
2. **Logic**: `phone_numerology.py` - Pure deterministic calculations (sanitization, validation, reductions, positional analysis)
3. **Service**: `phone_explainer.py` - LLM wrapper for generating explanations
4. **Worker**: `generate_phone_report` - Celery task for async report generation
5. **Views**: API endpoints for generate, preview, get, and compatibility
6. **Serializers**: Request/response models for API

### Frontend Components

1. **Form**: `PhoneNumerologyForm.tsx` - Input form with client-side preview
2. **Report**: `PhoneNumerologyReport.tsx` - Display component for persisted reports
3. **Page**: `phone-numerology/page.tsx` - Main page for phone numerology feature

## API Endpoints

### POST `/api/v1/phone-numerology/generate`

Generate a phone numerology report (queued task).

**Request:**
```json
{
  "phone_number": "+1 (415) 555-2671",
  "country_hint": "US",
  "method": "core",
  "persist": true,
  "force_refresh": false,
  "convert_vanity": false
}
```

**Response:** `202 Accepted`
```json
{
  "job_id": "uuid",
  "status": "queued"
}
```

### POST `/api/v1/phone-numerology/preview`

Preview phone numerology results without persisting.

**Request:** Same as generate endpoint

**Response:** `200 OK`
```json
{
  "phone_e164": "+14155552671",
  "phone_display": "+1415****2671",
  "country": "US",
  "computed": {
    "digits": ["4","1","5","5","5","5","2","6","7","1"],
    "core_number": {
      "raw_total": 41,
      "reduced": 5,
      "reduction_steps": [41, 5]
    },
    "positional_sequence": [...],
    "pair_sums": [...],
    "repeated_digits": {"5": 4, "1": 2},
    "dominant_digit": "5"
  }
}
```

### GET `/api/v1/phone-numerology/{user_id}/{report_id}`

Get a specific phone report by ID.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "user": "user_id",
  "phone_e164_display": "+1415****2671",
  "method": "core",
  "computed": {...},
  "explanation": {
    "short_summary": "...",
    "long_explanation": "...",
    "action_points": [...],
    "confidence_notes": "..."
  },
  "computed_at": "2025-12-02T10:00:00Z"
}
```

### GET `/api/v1/phone-numerology/{user_id}/latest`

Get the latest phone report for a user.

**Query Params:**
- `method` (optional): Filter by method

**Response:** `200 OK` - Same format as get report

### POST `/api/v1/phone-numerology/compatibility`

Check compatibility between two phone numbers.

**Request:**
```json
{
  "phone1": "+14155552671",
  "phone2": "+14155552672",
  "user_id1": "uuid",
  "user_id2": "uuid",
  "country_hint": "US",
  "convert_vanity": false
}
```

**Response:** `200 OK`
```json
{
  "compatibility_score": 85,
  "core_number_1": 5,
  "core_number_2": 6,
  "difference": 1,
  "base_score": 89,
  "shared_digits_modifier": 5,
  "shared_digits": ["5", "1"]
}
```

## Database Schema

```sql
CREATE TABLE phone_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id bigint NOT NULL,
  phone_raw text NOT NULL,
  phone_e164 text NOT NULL,
  country text,
  method text NOT NULL,
  computed jsonb NOT NULL,
  explanation jsonb,
  explanation_error text,
  computed_at timestamptz DEFAULT now(),
  version integer DEFAULT 1
);

CREATE INDEX idx_phone_reports_userid ON phone_reports(user_id);
CREATE INDEX idx_phone_reports_user_method ON phone_reports(user_id, method);
```

**PII Note:** Phone numbers are treated as PII. Consider encryption at rest for `phone_raw` and `phone_e164` fields. The `persist=false` option allows computation without storage.

## Sanitization & Validation

The `sanitize_and_validate_phone` function:

1. Trims whitespace
2. Removes common separators `() - .` and extension words
3. Converts `00` prefix to `+` (e.g., `0044...` → `+44...`)
4. Handles missing country codes with `country_hint`
5. Validates digit length (6-15 per E.164)
6. Returns E.164 format and metadata

**Edge Cases:**
- Extensions: Stripped and stored in metadata
- Vanity numbers: Rejected by default, can be converted with `convert_vanity=true`
- Unicode digits: Normalized to ASCII

## Numerology Calculations

### Core Number

Primary vibration from phone number digits. Default scope is `"national"` (excludes country code), can be `"full"` (includes country code).

**Example:** `+1 415 555 2671`
- National digits: `4155552671`
- Sum: `4+1+5+5+5+5+2+6+7+1 = 41`
- Reduced: `4+1 = 5`

### Positional Sequence

Running cumulative totals for each digit position, showing how vibration builds.

### Pair Sums

Pairwise sums of adjacent digits, useful for compatibility analysis.

### Repeated Digits

Frequency map of digits, with `dominant_digit` marked if any appears ≥3 times.

### Compatibility Score

Deterministic compatibility between two numbers:
- Base score: `100 - (difference * 11)` clipped to 0-100
- Modifier: `+5` per shared digit (max +15)

## LLM Explanation

The LLM explainer uses a prompt template at `app/services/prompts/phone_explainer_prompt.txt` to generate:

- `short_summary`: One sentence ≤120 chars
- `long_explanation`: 2-4 paragraphs ≤300 words
- `action_points`: 3 practical suggestions
- `confidence_notes`: Uncertainty/assumptions

The explainer references evidence tags (E1-E5) from the computed data.

## Configuration Options

- `core_scope`: `"national"` (default) or `"full"`
- `keep_master`: `False` (default) - preserve 11/22/33 in reductions
- `convert_vanity`: `False` (default) - convert letters to dial digits
- `min_digits`: `6` (default) - minimum phone digits
- `max_digits`: `15` (default) - maximum phone digits (E.164)
- `persist`: `true` (default) - save to database
- `masking_policy`: Mask middle 4 digits in UI by default

## Testing

### Unit Tests

- `test_phone_sanitization.py`: Sanitization and validation tests
- `test_phone_reduction.py`: Numerology calculation tests
- `test_phone_worker.py`: Worker task tests with mocked LLM

### Acceptance Criteria

✅ POST `/generate` accepts phone strings, returns job_id 202, worker persists  
✅ POST `/preview` returns computed payload without storing  
✅ GET `/latest` returns last persisted report  
✅ Sanitization produces canonical E.164 for valid inputs  
✅ Invalid inputs return 400 with helpful reason  
✅ Vanity numbers rejected unless `convert_vanity=true`  
✅ Deterministic calculations produce consistent results  
✅ LLM explainer stores explanation JSON or error field  
✅ Frontend preview matches server-side output  
✅ Report page displays masked phone by default  

## Privacy & Security

- Phone numbers treated as PII
- Masked display in UI (e.g., `+1415****2671`)
- Configurable persistence (`persist=false` for ephemeral preview)
- Consider encryption at rest for production
- Log access to phone fields for audit compliance

## Examples

### Example Request

```bash
curl -X POST http://localhost:8000/api/v1/phone-numerology/generate/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "+1 (415) 555-2671",
    "country_hint": "US",
    "method": "core",
    "persist": true
  }'
```

### Example Response

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "phone_e164_display": "+1415****2671",
  "method": "core",
  "computed": {
    "core_number": {
      "raw_total": 41,
      "reduced": 5,
      "reduction_steps": [41, 5]
    },
    "dominant_digit": "5",
    "repeated_digits": {"5": 4, "1": 2}
  },
  "explanation": {
    "short_summary": "Core vibration 5 emphasizes change and freedom.",
    "long_explanation": "...",
    "action_points": [
      "Use this number for creative outreach",
      "Pair it with stationary 4 to stabilize",
      "Mind impulsiveness around financial choices"
    ],
    "confidence_notes": "Computed from national digits; country code excluded by default."
  }
}
```

## Future Enhancements

- Full country code database for better parsing
- Support for multiple phone numbers per user
- Phone number change tracking and history
- Integration with carrier APIs for validation
- Advanced compatibility analysis with multiple factors
- Export to PDF functionality
- Share links with expiring tokens

