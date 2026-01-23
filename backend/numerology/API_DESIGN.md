# Numerology Engine API Design

This document outlines the API endpoints for the newly integrated numerology engines.

## 1. Core Numbers (Birth & Destiny)
**Endpoint:** `POST /api/v1/numerology/core-numbers/`
**Description:** Calculates birth number, destiny number, master numbers, and karmic debts.
**Input:**
```json
{
  "day": 15,
  "month": 9,
  "year": 1990
}
```
**Output:**
```json
{
  "birth_number": 6,
  "destiny_number": 7,
  "master_numbers": [],
  "karmic_debts": [],
  "birth_traits": { ... },
  "destiny_traits": { ... },
  "warnings": [],
  "status": "deterministic"
}
```

## 2. Personal Year & Eventful Year
**Endpoint:** `POST /api/v1/numerology/predictive/yearly/`
**Description:** Calculates personal year, eventful year status, and success/caution years.
**Input:**
```json
{
  "birth_day": 15,
  "birth_month": 9,
  "birth_year": 1990,
  "target_year": 2024
}
```
**Output:**
```json
{
  "personal_year": 1,
  "universal_year": 8,
  "running_age": 34,
  "status": "Double Strength Success Year",
  "significance": "New Beginning",
  "remedies": [ ... ],
  "warnings": []
}
```

## 3. Compatibility Engine
**Endpoint:** `POST /api/v1/numerology/compatibility/check-81/`
**Description:** Detailed compatibility check based on 81 combinations of birth and destiny numbers.
**Input:**
```json
{
  "person1": { "birth_number": 1, "destiny_number": 1 },
  "person2": { "birth_number": 2, "destiny_number": 2 }
}
```
**Output:**
```json
{
  "birth_compatibility": "Excellent",
  "destiny_compatibility": "Good",
  "score": 85,
  "interpretation": "...",
  "warnings": []
}
```

## 4. Lo Shu Grid & Missing Numbers
**Endpoint:** `POST /api/v1/numerology/lo-shu/analyze/`
**Description:** Generates Lo Shu grid, identifies missing numbers, and provides remedies.
**Input:**
```json
{
  "birth_date": "1990-09-15"
}
```
**Output:**
```json
{
  "grid": [ [4, 9, 2], [3, 5, 7], [8, 1, 6] ],
  "missing_numbers": [ ... ],
  "arrows_of_strength": [ ... ],
  "remedies": [ ... ]
}
```

## 5. Compound Number Interpreter
**Endpoint:** `GET /api/v1/numerology/compound/<int:number>/`
**Description:** Retrieves interpretation for any compound number (1-100+).
**Output:**
```json
{
  "number": 53,
  "meaning": "Success in spying",
  "vibration": "Similar to 8",
  "warnings": [ "Personal life not so normal" ]
}
```

## 6. Business Numerology
**Endpoint:** `POST /api/v1/numerology/business/analyze/`
**Description:** Analyzes business name vibration and owner compatibility.
**Input:**
```json
{
  "business_name": "Tech Corp",
  "owner_birth_number": 1
}
```
**Output:**
```json
{
  "name_number": 24,
  "compatibility": "Lucky",
  "suitable_industries": [ ... ],
  "remedies": []
}
```

## 7. Kua & Feng Shui
**Endpoint:** `POST /api/v1/numerology/feng-shui/kua/`
**Description:** Calculates Kua number and lucky directions.
**Input:**
```json
{
  "year": 1990,
  "gender": "male"
}
```
**Output:**
```json
{
  "kua_number": 1,
  "lucky_directions": [ "North", "South", "East", "Southeast" ],
  "unlucky_directions": [ ... ]
}
```

## 8. Health & Kabala
**Endpoint:** `POST /api/v1/numerology/health/kabala-analysis/`
**Description:** Analyzes name vibration for health risks using Kabala system.
**Input:**
```json
{
  "name": "John Doe"
}
```
**Output:**
```json
{
  "vibration": 12,
  "health_risks": [ "Stomach issues", "Anxiety" ],
  "remedies": [ "Yoga", "Specific crystals" ]
}
```
