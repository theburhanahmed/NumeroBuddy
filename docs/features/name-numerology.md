# Name Numerology Feature

## Overview

The Name Numerology feature provides comprehensive analysis of names using numerology principles. It calculates key numbers (Expression, Soul Urge, Personality, Name Vibration) and generates AI-powered explanations.

## Features

- **Name Normalization**: Handles diacritics, transliteration, and punctuation
- **Multiple Systems**: Supports Pythagorean and Chaldean numerology systems
- **Number Calculations**: Expression, Soul Urge, Personality, and Name Vibration numbers
- **LLM Explanations**: AI-generated personalized explanations
- **Client-side Preview**: Instant feedback without persistence
- **Report Persistence**: Save and retrieve name numerology reports

## API Endpoints

### POST `/api/v1/name-numerology/generate/`

Generate a name numerology report (queues async task).

**Request:**
```json
{
  "name": "John Doe",
  "name_type": "birth",
  "system": "pythagorean",
  "transliterate": true,
  "force_refresh": false
}
```

**Response (202 Accepted):**
```json
{
  "job_id": "uuid",
  "status": "queued"
}
```

### POST `/api/v1/name-numerology/preview/`

Preview name numerology results without persisting.

**Request:**
```json
{
  "name": "John Doe",
  "system": "pythagorean",
  "transliterate": true
}
```

**Response (200 OK):**
```json
{
  "normalized_name": "john doe",
  "numbers": {
    "expression": {
      "raw_total": 46,
      "reduced": 1,
      "reduction_steps": [46, 10, 1]
    },
    "soul_urge": {
      "raw_total": 15,
      "reduced": 6,
      "reduction_steps": [15, 6],
      "letters": ["o", "o", "e"]
    },
    "personality": {
      "raw_total": 31,
      "reduced": 4,
      "reduction_steps": [31, 4],
      "letters": ["j", "h", "n", "d"]
    },
    "name_vibration": 1
  },
  "breakdown": [...],
  "word_totals": [...]
}
```

### GET `/api/v1/name-numerology/{user_id}/{report_id}/`

Get a specific name numerology report.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "user": "user_uuid",
  "name": "John Doe",
  "name_type": "birth",
  "system": "pythagorean",
  "normalized_name": "john doe",
  "numbers": {...},
  "breakdown": [...],
  "explanation": {
    "short_summary": "...",
    "long_explanation": "...",
    "action_points": ["...", "...", "..."],
    "confidence_notes": "..."
  },
  "computed_at": "2025-12-02T10:00:00Z",
  "version": 1
}
```

### GET `/api/v1/name-numerology/{user_id}/latest/`

Get the latest name numerology report for a user.

**Query Parameters:**
- `name_type` (optional): Filter by name type
- `system` (optional): Filter by system

**Response (200 OK):** Same as GET report endpoint

## Numerology Systems

### Pythagorean System

The most common numerology system. Letter values:
- A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9
- J=1, K=2, L=3, M=4, N=5, O=6, P=7, Q=8, R=9
- S=1, T=2, U=3, V=4, W=5, X=6, Y=7, Z=8

### Chaldean System

An alternative numerology system. Letter values:
- A=1, B=2, C=3, D=4, E=5, F=8, G=3, H=5, I=1
- J=1, K=2, L=3, M=4, N=5, O=7, P=8, Q=1, R=2
- S=3, T=4, U=6, V=6, W=6, X=5, Y=1, Z=7

## Calculated Numbers

### Expression Number

The sum of all letters in the name, reduced to a single digit (or master number). Represents overall personality and life path.

### Soul Urge Number

The sum of vowels only, reduced to a single digit. Represents inner desires and motivations.

### Personality Number

The sum of consonants only, reduced to a single digit. Represents how others perceive you.

### Name Vibration

The final reduced expression number. Represents the overall energy of the name.

## Master Numbers

Master numbers (11, 22, 33) are preserved when `keep_master=True`. These numbers have special significance and are not reduced further.

## Name Normalization

Names are normalized through the following steps:

1. **Whitespace**: Leading/trailing whitespace removed, multiple spaces collapsed
2. **Punctuation**: Removed (apostrophes and hyphens converted to spaces)
3. **Diacritics**: Stripped using Unicode normalization
4. **Lowercase**: Converted to lowercase
5. **Transliteration**: Non-Latin characters transliterated (if enabled)
6. **Cleanup**: Non-letter characters removed

## Transliteration

The system supports transliteration of non-Latin characters through a configurable JSON map (`backend/config/transliteration.json`). Common mappings include:

- Cyrillic: ш→sh, ч→ch, ж→zh
- Turkish: ğ→g, ş→s, ö→o, ü→u
- Spanish: ñ→n, é→e, á→a
- And more...

## LLM Explanations

Reports include AI-generated explanations with:

- **Short Summary**: One sentence overview (≤120 chars)
- **Long Explanation**: 2-4 paragraphs with evidence references (≤300 words)
- **Action Points**: 3 practical suggestions
- **Confidence Notes**: Uncertainty or master number handling notes

Explanations reference evidence tags (E1, E2, etc.) that correspond to calculated numbers and key letters.

## Database Schema

```sql
CREATE TABLE name_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id bigint NOT NULL,
  name text NOT NULL,
  name_type text NOT NULL,
  system text NOT NULL,
  normalized_name text NOT NULL,
  numbers jsonb NOT NULL,
  breakdown jsonb NOT NULL,
  explanation jsonb,
  explanation_error text,
  computed_at timestamptz DEFAULT now(),
  version integer DEFAULT 1
);
```

## Security & Privacy

- Names are treated as PII (Personally Identifiable Information)
- All endpoints require authentication
- Users can only access their own reports
- Consider encrypting `name` and `normalized_name` fields at rest for production

## Error Handling

- Empty names return 400 Bad Request
- Invalid systems return 400 Bad Request
- LLM failures result in reports with `explanation=null` and `explanation_error` populated
- Non-Latin characters without transliteration mapping are removed with a confidence note

## Testing

Unit tests cover:
- Letter mappings (Pythagorean and Chaldean)
- Name normalization and transliteration
- Number calculations and reductions
- Master number handling
- Edge cases (empty names, invalid systems, etc.)

Run tests:
```bash
pytest backend/numerology/tests/test_name_numerology.py
pytest backend/numerology/tests/test_letter_mappings.py
pytest backend/numerology/tests/test_name_normalization.py
```

## Frontend Usage

### Generate Report

```typescript
import { nameNumerologyAPI } from '@/lib/numerology-api';

const result = await nameNumerologyAPI.generateReport({
  name: 'John Doe',
  name_type: 'birth',
  system: 'pythagorean',
  transliterate: true
});

// Poll for completion
const report = await nameNumerologyAPI.getLatestReport(userId);
```

### Preview

```typescript
const preview = await nameNumerologyAPI.preview({
  name: 'John Doe',
  system: 'pythagorean',
  transliterate: true
});
```

## Examples

### Example: "Émilie O'Connor"

**Normalized:** `emilie o connor`

**Pythagorean:**
- Expression: 46 → 10 → 1
- Soul Urge: 15 → 6
- Personality: 31 → 4
- Name Vibration: 1

**Breakdown:**
- e (vowel, 5)
- m (consonant, 4)
- i (vowel, 9)
- l (consonant, 3)
- ...

## Future Enhancements

- Support for multiple names (first, middle, last separately)
- Comparison between different names
- Historical tracking of name changes
- Custom transliteration maps per user
- Batch processing for multiple names
- Export to PDF with formatting
- Integration with birth numerology for combined insights

