# Validation Checklist

This checklist is used by the ValidationMode system to track all calculations, conflicts, and decisions.

## 1. Calculation Verification

### What Was Calculated
- [x] **Birth & Destiny**: Correct single-digit reduction applied?
- [x] **Master Numbers**: 11, 22, 33 preserved without reduction?
- [x] **Personal Year**: Universal Year + Birth Day/Month formula correct?
- [x] **Kua Number**: Gender-specific formulas (11-x for men, x+4 for women) correct?
- [x] **Name Value**: Chaldean mapping applied correctly?
- [x] **Compound Numbers**: All conditions evaluated correctly?
- [x] **Lo Shu Grid**: Missing numbers identified correctly?
- [x] **Compatibility**: 81-combination ratings applied correctly?

### Calculation Tracking
All calculations are recorded with:
- Engine name
- Calculation type
- Input values
- Output values
- Deterministic flag

## 2. Ingestion Integrity

### What Was Ignored
- [x] **Ignored Content**: Are all celebrity stories and marketing text removed?
- [x] **Knowledge Alignment**: Are rules categorized into correct knowledge folders?
- [x] **Deterministic Marking**: Are calculations marked as deterministic and remedies as advisory?

### Ignored Items Tracking
All ignored items are recorded with:
- Item description
- Reason for ignoring
- Category (stories, examples, marketing, etc.)

## 3. Conflict & Logic Checks

### Why Recommendations Were Allowed/Blocked
- [x] **Karmic Flags**: Are 13, 14, 16, 19 flagged with specific warnings?
- [x] **Compatibility Conflicts**: Are "Enemy" psychic numbers blocking "OK" ratings?
- [x] **Remedy Exceptions**: Is Sun worship blocked for 8-9 combinations?
- [x] **Mobile Digits**: Are 4 and 8 digits flagged even if total is lucky?
- [x] **Name Correction**: Is name correction mandatory when name total 4/8 + birth 4/8?
- [x] **Personal Year Override**: Do Personal Year restrictions override compound numbers?
- [x] **Opposite Numbers**: Do internal conflicts override compatibility ratings?

### Recommendation Tracking
All recommendations are tracked with:
- Recommendation description
- Reason for allowing/blocking
- Conditions that enabled it (for allowed)
- Blocking rules (for blocked)

## 4. Risk Detection

### What Risks Were Detected
- [x] **Fatalistic Warning**: Are numbers 16, 18, 26, 43 explicitly marked with failure/danger warnings?
- [x] **Health Indicators**: Are Kabala health traits mapped to numbers 1-22 accurately?
- [x] **Stagnation Timing**: Is Personal Year 7 identified as a non-expansion year?
- [x] **Risky Numbers**: Are 4, 8, 13, 16, 26, 28 flagged?
- [x] **Karmic Debts**: Are 13, 14, 16, 19 detected?
- [x] **Missing Risky Numbers**: Are missing 4 and 8 flagged?

### Risk Tracking
All risks are recorded with:
- Risk type
- Severity (high, medium, low)
- Description
- Affected numbers

## 5. Conflict Resolution

### Conflicts Resolved
All conflicts are tracked with:
- Conflict type
- Resolution applied
- Priority rule used
- Overridden values

### Conflict Types
- Karmic debt overrides
- Risky number overrides
- Temporal overrides (Personal Year)
- Compatibility overrides (Enemy, Opposite)
- Missing number overrides
- Business restrictions (Mobile digits, Name correction)

## 6. Warnings Emitted

### Warning Tracking
All warnings are recorded with:
- Warning type
- Severity level
- Message
- Override flag (whether it overrides optimistic traits)

### Warning Categories
- High severity: Override optimistic traits
- Medium severity: Advisory warnings
- Low severity: Informational warnings

## Validation Report Structure

```json
{
  "summary": {
    "total_calculations": 0,
    "total_ignored": 0,
    "recommendations_allowed": 0,
    "recommendations_blocked": 0,
    "risks_detected": 0,
    "conflicts_resolved": 0,
    "warnings_emitted": 0
  },
  "validation_summary": {
    "deterministic_calculations": 0,
    "non_deterministic_calculations": 0,
    "high_severity_warnings": 0,
    "medium_severity_warnings": 0,
    "low_severity_warnings": 0,
    "validation_passed": true
  },
  "calculations": [],
  "ignored_items": [],
  "recommendations_allowed": [],
  "recommendations_blocked": [],
  "risks_detected": [],
  "conflicts_resolved": [],
  "warnings_emitted": []
}
```

## Usage

The ValidationMode system is used by all engines to:
1. Track what was calculated
2. Record what was ignored
3. Document why recommendations were allowed or blocked
4. Detect and record risks
5. Resolve conflicts
6. Emit warnings

All validation data is available through the `generate_validation_report()` method.
