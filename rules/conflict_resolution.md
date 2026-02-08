# Conflict Resolution Rules

Based on strict document ingestion, the following priority logic must be applied during analysis.

**PRIORITY ORDER (Highest to Lowest):**
1. Calculation Integrity (Master Numbers, Single Digit Stop)
2. Core Number Overrides (Karmic Debts, Risky Numbers, Sun Worship, Name Correction)
3. Temporal Overrides (Personal Year, Lost Opportunities)
4. Compatibility Overrides (Enemy Numbers, Opposite Numbers)
5. Missing Number Overrides (Missing Risky Numbers)
6. Business & Branding (Mobile Digits, Proprietor Priority)

---

## 1. Calculation Integrity (HIGHEST PRIORITY)

### Master Numbers (11, 22, 33)
**Rule:** Master numbers must NEVER be reduced during intermediate calculation steps.
**Priority:** HIGHEST - Overrides all reduction logic
**Examples:**
- Birth day 11 → Keep as 11, do NOT reduce to 2
- Destiny sum 22 → Keep as 22, do NOT reduce to 4
- Full DOB sum 33 → Keep as 33, do NOT reduce to 6

**Implementation:** All engines must check for master numbers before any reduction.

### Single Digit Stop (Name Numerology)
**Rule:** If the first row of a name sum results in a single digit, further reduction is blocked.
**Priority:** HIGHEST - Prevents invalid reduction
**Example:**
- First name sum = 5 → Stop, do NOT reduce further
- Only reduce if sum is double-digit (10-99)

---

## 2. Core Number Overrides

### Karmic Debts (13, 14, 16, 19) and Risky Numbers (4, 8, 13, 16, 26, 28)
**Rule:** These numbers ALWAYS trigger mandatory warnings and override optimistic traits.
**Priority:** HIGH - Overrides compound numbers, compatibility ratings, and business harmony
**Examples:**
- Compound Number 60 (lucky) + Birth Number 4 → Risky number warning OVERRIDES compound optimism
- Compatibility 80% + Karmic Debt 13 → Warning OVERRIDES compatibility rating
- Business name harmony + Name total 4 + Birth 4 → Name correction REQUIRED

**Implementation:** ConflictResolver.validate_karmic_debts() and validate_risky_numbers()

### Sun Worship Exclusion
**Rule:** If Birth Number is 8 AND Destiny Number is 9, sun-related remedies are STRICTLY PROHIBITED.
**Priority:** HIGH - Blocks specific remedies
**Blocked Remedies:**
- Sun Argh (before 8am)
- Sunlight exposure (10 minutes)
- Red Garnet, Red Jasper
- 1 Mukhi Rudraksha
- Red thread

**Implementation:** ConflictResolver.validate_sun_worship_exclusion()

### Name Correction Priority
**Rule:** If name total is 4 or 8 AND birth number is 4 or 8, name MUST be changed.
**Priority:** HIGH - Overrides positive letter vibrations
**Examples:**
- Name total 4 + Birth 4 → MANDATORY name change (even if letters are positive)
- Name total 8 + Birth 8 → MANDATORY name change
- Name total 4 + Birth 1 → No override (different numbers)

**Implementation:** ConflictResolver.validate_name_correction_priority()

---

## 3. Temporal Overrides

### Personal Year vs. Compound Numbers
**Rule:** Personal Year traits override long-term compound number traits for CURRENT TIMING.
**Priority:** MEDIUM-HIGH - Applies to timing-specific analysis
**Examples:**
- Compound Number 60 (lucky) + Personal Year 4 (restrictive) → Personal Year 4 restrictions OVERRIDE compound 60 optimism for this year
- Compound Number 60 (lucky) + Personal Year 5 (active) → Both apply (no conflict)
- Compound Number 26 (risky) + Personal Year 8 (material success) → Compound 26 warning OVERRIDES Personal Year 8 optimism

**Restrictive Personal Years:** 4, 9 (override compound optimism)
**Active Personal Years:** 1, 5, 8 (may align with compound numbers)

**Implementation:** ConflictResolver.validate_personal_year_override()

### Lost Opportunities (Personal Year 1)
**Rule:** Opportunities in Personal Year 1 are prioritized. If lost, blocked for next 9-year cycle.
**Priority:** MEDIUM-HIGH - Long-term impact
**Example:**
- Personal Year 1 opportunity missed → Blocked until next Personal Year 1 (9 years later)
- Cannot be overridden by lucky compound numbers or compatibility

**Implementation:** PersonalYearEngine checks for PY1 and emits warning

---

## 4. Compatibility Overrides

### Enemy Numbers
**Rule:** If partner's psychic number is an "Enemy" to subject's psychic number, this OVERRIDES general compatibility rating.
**Priority:** MEDIUM-HIGH - Overrides 81-combination ratings
**Enemy Mappings (from Eklavya Brahmastra):**
- 1 → Enemy: [8]
- 2 → Enemy: [4, 6, 8, 9]
- 3 → Enemy: [6]
- 4 → Enemy: [2, 8, 9]
- 6 → Enemy: [3]
- 8 → Enemy: [1, 2, 4, 9]
- 9 → Enemy: [2, 4, 6, 8]

**Examples:**
- Compatibility rating 80% + Psychic 1 vs Psychic 8 → Enemy conflict OVERRIDES 80% rating
- Compatibility rating 60% + Psychic 2 vs Psychic 4 → Enemy conflict OVERRIDES 60% rating

**Implementation:** ConflictResolver.validate_enemy_numbers()

### Opposite Numbers (Internal Conflict)
**Rule:** Psychic-Destiny internal conflicts override optimistic 81-combination ratings.
**Priority:** MEDIUM-HIGH - Internal conflict takes precedence
**Opposite Mappings:**
- 1 → Opposite: [8]
- 2 → Opposite: [4, 6, 8, 9]
- 3 → Opposite: [6]
- 4 → Opposite: [2, 8, 9]
- 6 → Opposite: [3]
- 8 → Opposite: [1, 2, 4, 9]
- 9 → Opposite: [2, 4, 6, 8]

**Examples:**
- 81-combination rating 100% + Psychic 1 + Destiny 8 → Opposite conflict OVERRIDES 100% rating
- Internal conflict (1-8) takes precedence over external compatibility

**Implementation:** ConflictResolver.validate_opposite_numbers()

---

## 5. Missing Number Overrides

### Missing Risky Numbers
**Rule:** Missing risky numbers (4, 8) override compatibility optimism.
**Priority:** MEDIUM - Applies when missing numbers are risky
**Examples:**
- Compatibility 90% + Missing Number 4 → Missing 4 warning OVERRIDES compatibility optimism
- Missing Number 8 + Good compound number → Missing 8 warning takes precedence

**Implementation:** LoShuEngine checks for missing risky numbers

---

## 6. Business & Branding

### Proprietor Grid Priority
**Rule:** Business name harmony calculated against Proprietor's Birth and Destiny numbers FIRST.
**Priority:** MEDIUM - Business partner grids are secondary
**Example:**
- Proprietor Birth 1 + Destiny 5 → Business name must harmonize with 1 and 5
- Partner Birth 3 + Destiny 7 → Secondary consideration only

**Implementation:** BusinessEngine.analyze_business() prioritizes proprietor numbers

### Mobile Digit Restriction
**Rule:** Presence of digits 4 or 8 triggers "Malefic" warning REGARDLESS of total sum.
**Priority:** MEDIUM-HIGH - Overrides lucky total
**Examples:**
- Mobile total 60 (lucky) + Contains digit 4 → Malefic warning OVERRIDES lucky total
- Mobile total 37 (lucky) + Contains digit 8 → Malefic warning OVERRIDES lucky total
- Mobile total 41 + Contains digit 4 → Malefic warning (even if 41 is favorable)

**Implementation:** ConflictResolver.validate_mobile_digit_restriction()

---

## Conflict Resolution Flow

```
1. Check Calculation Integrity (Master Numbers, Single Digit Stop)
   ↓ If violation → STOP and emit error
   
2. Check Core Number Overrides (Karmic Debts, Risky Numbers)
   ↓ If detected → Emit HIGH severity warning, override optimistic traits
   
3. Check Temporal Overrides (Personal Year vs Compound)
   ↓ If conflict → Emit MEDIUM-HIGH warning, apply temporal restrictions
   
4. Check Compatibility Overrides (Enemy, Opposite Numbers)
   ↓ If conflict → Emit MEDIUM-HIGH warning, override compatibility rating
   
5. Check Missing Number Overrides (Missing Risky Numbers)
   ↓ If detected → Emit MEDIUM warning
   
6. Check Business & Branding (Mobile Digits, Proprietor Priority)
   ↓ If violation → Emit MEDIUM-HIGH warning
```

---

## Implementation Notes

- All engines inherit from `NumerologyBaseEngine` which includes `ConflictResolver`
- Warnings are emitted through `ConflictResolver` methods
- High-severity warnings with `override: True` block optimistic traits
- Conflict resolution is applied BEFORE returning results
- Validation checklist tracks all conflicts resolved

---

## Examples of Conflict Resolution

### Example 1: Karmic Debt Override
```
Input: Birth Day 13, Compound Number 60 (lucky)
Process:
  1. Detect Karmic Debt 13 → HIGH severity warning
  2. Compound Number 60 → Lucky traits
  3. Conflict: Karmic Debt 13 OVERRIDES compound 60 optimism
Result: Warning emitted, compound optimism blocked
```

### Example 2: Personal Year Override
```
Input: Compound Number 60 (lucky), Personal Year 4 (restrictive)
Process:
  1. Compound Number 60 → Lucky traits
  2. Personal Year 4 → Restrictive traits
  3. Conflict: Personal Year 4 OVERRIDES compound 60 for timing
Result: Temporal override warning, compound optimism blocked for this year
```

### Example 3: Enemy Number Override
```
Input: Compatibility 80%, Psychic 1 vs Psychic 8
Process:
  1. Compatibility rating → 80%
  2. Enemy check: 8 is enemy of 1 → Conflict detected
  3. Conflict: Enemy number OVERRIDES 80% rating
Result: Rating overridden, enemy conflict warning emitted
```

### Example 4: Mobile Digit Override
```
Input: Mobile total 60 (lucky), Contains digit 4
Process:
  1. Mobile total 60 → Lucky number
  2. Digit check: Contains 4 → Malefic detected
  3. Conflict: Digit 4 OVERRIDES lucky total
Result: Malefic warning emitted, lucky total overridden
```
