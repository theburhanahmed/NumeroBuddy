# NumerAI Backend API Documentation

## Complete API Endpoints Reference

**Base URL:** `/api/v1/`

---

## Table of Contents

1. [Authentication & Accounts](#authentication--accounts)
2. [Numerology Core](#numerology-core)
3. [Numerology Engines](#numerology-engines)
4. [Reports & Readings](#reports--readings)
5. [Compatibility & Relationships](#compatibility--relationships)
6. [Business & Assets](#business--assets)
7. [Health & Wellness](#health--wellness)
8. [Spiritual & Predictive](#spiritual--predictive)
9. [Payments & Subscriptions](#payments--subscriptions)
10. [AI Chat](#ai-chat)
11. [Additional Features](#additional-features)

---

## Authentication & Accounts

### POST `/auth/register/`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe",
  "phone_number": "+1234567890"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "message": "OTP sent to your email"
}
```

### POST `/auth/verify-otp/`
Verify OTP code sent to email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp_code": "123456"
}
```

**Response:**
```json
{
  "access_token": "jwt_access_token",
  "refresh_token": "jwt_refresh_token",
  "user": {...}
}
```

### POST `/auth/login/`
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "access_token": "jwt_access_token",
  "refresh_token": "jwt_refresh_token",
  "user": {...}
}
```

### POST `/auth/refresh-token/`
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "jwt_refresh_token"
}
```

**Response:**
```json
{
  "access_token": "new_jwt_access_token"
}
```

### GET `/users/profile/`
Get current user profile.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "phone_number": "+1234567890",
  "birth_date": "1990-06-15",
  "subscription_tier": "premium"
}
```

### PUT `/users/profile/`
Update user profile.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "full_name": "John Updated Doe",
  "birth_date": "1990-06-15"
}
```

---

## Numerology Core

### POST `/numerology/calculate/`
Calculate and save user's numerology profile.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "full_name": "John Doe",
  "birth_date": "1990-06-15",
  "system": "pythagorean"
}
```

**Response:**
```json
{
  "id": "uuid",
  "life_path_number": 5,
  "destiny_number": 7,
  "soul_urge_number": 3,
  "personality_number": 4,
  "attitude_number": 2,
  "maturity_number": 3,
  "balance_number": 6,
  "personal_year_number": 8,
  "personal_month_number": 1,
  "driver_number": 6,
  "conductor_number": 7,
  "calculation_system": "pythagorean",
  "calculated_at": "2025-02-01T10:00:00Z"
}
```

### GET `/numerology/profile/`
Get user's numerology profile.

**Headers:** `Authorization: Bearer {access_token}`

**Response:** Same as calculate response

### GET `/numerology/birth-chart/`
Get detailed birth chart analysis.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "core_numbers": {...},
  "life_path_analysis": {...},
  "destiny_analysis": {...},
  "soul_urge_analysis": {...},
  "personality_analysis": {...},
  "karmic_lessons": [...],
  "hidden_passions": [...]
}
```

### GET `/numerology/birth-chart/pdf/`
Export birth chart as PDF.

**Headers:** `Authorization: Bearer {access_token}`

**Response:** PDF file download

---

## Numerology Engines

### POST `/engines/core-numbers/`
Calculate Birth and Destiny numbers using engine.

**Request Body:**
```json
{
  "day": 15,
  "month": 6,
  "year": 1990,
  "enable_validation": false
}
```

**Response:**
```json
{
  "birth_number": 6,
  "destiny_number": 7,
  "birth_number_interpretation": "...",
  "destiny_number_interpretation": "...",
  "conflict_resolution": {...}
}
```

### POST `/engines/predictive/yearly/`
Calculate Personal Year and Eventful Year.

**Request Body:**
```json
{
  "birth_day": 15,
  "birth_month": 6,
  "birth_year": 1990,
  "target_year": 2025,
  "driver_number": 6,
  "compound_number": 60
}
```

**Response:**
```json
{
  "personal_year": 8,
  "eventful_year": 3,
  "personal_year_interpretation": "...",
  "eventful_year_interpretation": "...",
  "conflict_resolution": {...}
}
```

### POST `/engines/compatibility/check-81/`
Check compatibility using 81-combination rules.

**Request Body:**
```json
{
  "psychic1": 6,
  "destiny1": 7,
  "psychic2": 3,
  "destiny2": 5
}
```

**Response:**
```json
{
  "self_compatibility": {
    "combination": "6-7",
    "status": "Excellent",
    "interpretation": "..."
  },
  "partner_compatibility": {
    "combination": "3-5",
    "status": "Good",
    "interpretation": "..."
  },
  "cross_compatibility": {...},
  "conflict_resolution": {...}
}
```

### POST `/engines/lo-shu/analyze/`
Analyze Lo Shu Grid and Missing Numbers.

**Request Body:**
```json
{
  "dob_day": 15,
  "dob_month": 6,
  "dob_year": 1990,
  "driver": 6,
  "conductor": 7
}
```

**Response:**
```json
{
  "grid": {
    "1": 1,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 1,
    "6": 2,
    "7": 1,
    "8": 0,
    "9": 2
  },
  "missing_numbers": [2, 3, 4, 8],
  "prominent_numbers": [6, 9],
  "arrows": [...],
  "interpretation": "...",
  "remedies": [...]
}
```

### GET/POST `/engines/compound/<number>/`
Interpret compound number.

**Request Body (POST):**
```json
{
  "number": 60,
  "prominent_numbers": [6, 9],
  "destiny_number": 7,
  "birth_number": 6
}
```

**Response:**
```json
{
  "compound_number": 60,
  "root_number": 6,
  "interpretation": "...",
  "strengths": [...],
  "challenges": [...],
  "conflict_resolution": {...}
}
```

### POST `/engines/business/analyze/`
Analyze business name and mobile number.

**Request Body:**
```json
{
  "company_name": "ABC PVT LTD",
  "birth_number": 6,
  "destiny_number": 7,
  "phone_number": "9876543210"
}
```

**Response:**
```json
{
  "business_name_analysis": {
    "name_number": 5,
    "compatibility_with_owner": "Excellent",
    "interpretation": "...",
    "recommendations": [...]
  },
  "mobile_analysis": {
    "mobile_number": 8,
    "compatibility": "Good",
    "interpretation": "..."
  }
}
```

### POST `/engines/feng-shui/kua/`
Calculate Kua number and Feng Shui directions.

**Request Body:**
```json
{
  "birth_year": 1990,
  "gender": "male"
}
```

**Response:**
```json
{
  "kua_number": 7,
  "group": "West",
  "auspicious_directions": ["West", "Northwest", "Southwest", "Northeast"],
  "inauspicious_directions": ["East", "Southeast", "South", "North"],
  "best_direction": "West",
  "interpretation": "..."
}
```

### POST `/engines/health/kabala-analysis/`
Calculate Health & Kabala name analysis.

**Request Body:**
```json
{
  "name": "JOHN DOE",
  "birth_number": 6
}
```

**Response:**
```json
{
  "health_number": 8,
  "kabala_number": 3,
  "health_interpretation": "...",
  "kabala_interpretation": "...",
  "health_recommendations": [...],
  "conflict_resolution": {...}
}
```

---

## Reports & Readings

### GET `/numerology/daily-reading/`
Get daily numerology reading.

**Headers:** `Authorization: Bearer {access_token}`

**Query Parameters:**
- `date` (optional): YYYY-MM-DD format, defaults to today

**Response:**
```json
{
  "reading_date": "2025-02-01",
  "personal_day_number": 3,
  "lucky_number": 7,
  "lucky_color": "Blue",
  "auspicious_time": "10:00 AM - 12:00 PM",
  "activity_recommendation": "...",
  "warning": "...",
  "affirmation": "...",
  "actionable_tip": "...",
  "raj_yog_status": "Active",
  "raj_yog_insight": "..."
}
```

### GET `/numerology/reading-history/`
Get history of daily readings.

**Headers:** `Authorization: Bearer {access_token}`

**Query Parameters:**
- `days` (optional): Number of days to fetch, default 30

**Response:**
```json
{
  "readings": [
    {
      "reading_date": "2025-02-01",
      "personal_day_number": 3,
      ...
    }
  ],
  "count": 30
}
```

### GET `/numerology/weekly-report/`
Get weekly numerology report.

**Headers:** `Authorization: Bearer {access_token}`

**Query Parameters:**
- `week_start_date` (optional): YYYY-MM-DD format

**Response:**
```json
{
  "week_start": "2025-01-27",
  "week_end": "2025-02-02",
  "weekly_number": 5,
  "daily_forecasts": [...],
  "key_themes": [...],
  "opportunities": [...],
  "challenges": [...],
  "recommendations": [...]
}
```

### GET `/numerology/yearly-report/`
Get yearly numerology report.

**Headers:** `Authorization: Bearer {access_token}`

**Query Parameters:**
- `year` (optional): Year number, defaults to current year

**Response:**
```json
{
  "year": 2025,
  "personal_year": 8,
  "monthly_forecasts": [...],
  "key_themes": [...],
  "major_opportunities": [...],
  "challenges": [...],
  "pinnacles": [...],
  "recommendations": [...]
}
```

### GET `/numerology/full-report/`
Get comprehensive numerology report.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "profile": {...},
  "birth_chart": {...},
  "life_path_analysis": {...},
  "current_cycles": {...},
  "predictions": {...},
  "remedies": [...]
}
```

### GET `/numerology/full-report/pdf/`
Export full report as PDF.

**Headers:** `Authorization: Bearer {access_token}`

**Response:** PDF file download

---

## Compatibility & Relationships

### POST `/numerology/compatibility-check/`
Check compatibility with another person.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "partner_name": "Jane Smith",
  "partner_birth_date": "1992-08-20",
  "relationship_type": "romantic"
}
```

**Response:**
```json
{
  "compatibility_score": 85,
  "relationship_type": "romantic",
  "strengths": [
    "Strong emotional connection",
    "Complementary life paths"
  ],
  "challenges": [
    "Different communication styles"
  ],
  "advice": "...",
  "detailed_analysis": {...}
}
```

### GET `/numerology/compatibility-history/`
Get history of compatibility checks.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "checks": [
    {
      "id": "uuid",
      "partner_name": "Jane Smith",
      "compatibility_score": 85,
      "relationship_type": "romantic",
      "created_at": "2025-02-01T10:00:00Z"
    }
  ]
}
```

### POST `/numerology/compatibility/detailed/`
Get detailed compatibility breakdown.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "partner_name": "Jane Smith",
  "partner_birth_date": "1992-08-20"
}
```

**Response:**
```json
{
  "overall_score": 85,
  "life_path_compatibility": {...},
  "destiny_compatibility": {...},
  "soul_urge_compatibility": {...},
  "personality_compatibility": {...},
  "cycle_compatibility": {...},
  "strengths": [...],
  "challenges": [...],
  "growth_areas": [...]
}
```

### POST `/numerology/compatibility/timeline/`
Get relationship timeline predictions.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "partner_name": "Jane Smith",
  "partner_birth_date": "1992-08-20",
  "years_ahead": 5
}
```

**Response:**
```json
{
  "timeline": [
    {
      "year": 2025,
      "compatibility_score": 85,
      "key_themes": [...],
      "opportunities": [...],
      "challenges": [...]
    }
  ]
}
```

### POST `/numerology/compatibility/conflict-resolution/`
Get conflict resolution guidance.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "partner_name": "Jane Smith",
  "partner_birth_date": "1992-08-20",
  "conflict_area": "communication"
}
```

**Response:**
```json
{
  "conflict_analysis": {...},
  "root_causes": [...],
  "resolution_strategies": [...],
  "communication_tips": [...],
  "remedies": [...]
}
```

### POST `/numerology/compatibility/communication/`
Analyze communication styles.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "partner_name": "Jane Smith",
  "partner_birth_date": "1992-08-20"
}
```

**Response:**
```json
{
  "your_style": {...},
  "partner_style": {...},
  "compatibility": "Good",
  "tips": [...],
  "potential_misunderstandings": [...]
}
```

---

## Business & Assets

### POST `/numerology/business/`
Calculate business numerology.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "business_name": "Tech Innovations Inc",
  "registration_date": "2020-05-15"
}
```

**Response:**
```json
{
  "business_number": 7,
  "compatibility_with_owner": "Excellent",
  "interpretation": "...",
  "strengths": [...],
  "challenges": [...],
  "recommendations": [...]
}
```

### POST `/numerology/business/optimize-name/`
Get business name optimization suggestions.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "current_name": "Tech Innovations",
  "industry": "technology",
  "goals": ["growth", "innovation"]
}
```

**Response:**
```json
{
  "current_analysis": {...},
  "suggestions": [
    {
      "name": "Tech Innovations Plus",
      "number": 8,
      "score": 95,
      "reasoning": "..."
    }
  ]
}
```

### POST `/numerology/business/launch-dates/`
Calculate auspicious launch dates.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "start_date": "2025-03-01",
  "end_date": "2025-06-30",
  "event_type": "product_launch"
}
```

**Response:**
```json
{
  "best_dates": [
    {
      "date": "2025-03-15",
      "score": 98,
      "reasoning": "...",
      "auspicious_time": "10:00 AM"
    }
  ],
  "dates_to_avoid": [...]
}
```

### POST `/numerology/vehicle/`
Calculate vehicle numerology.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "license_plate": "ABC1234",
  "purchase_date": "2025-01-15"
}
```

**Response:**
```json
{
  "vehicle_number": 5,
  "compatibility": "Good",
  "interpretation": "...",
  "lucky_colors": [...],
  "maintenance_recommendations": [...]
}
```

### POST `/numerology/property/`
Calculate property numerology.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "address": "123 Main Street",
  "unit_number": "456",
  "purchase_date": "2024-06-15"
}
```

**Response:**
```json
{
  "property_number": 8,
  "compatibility": "Excellent",
  "interpretation": "...",
  "energy_analysis": {...},
  "feng_shui_tips": [...],
  "recommendations": [...]
}
```

---

## Health & Wellness

### GET `/numerology/health/`
Get health numerology profile.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "health_number": 6,
  "vulnerable_areas": [...],
  "strengths": [...],
  "recommendations": [...],
  "preventive_measures": [...]
}
```

### GET `/numerology/health/analysis/`
Get detailed health analysis.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "physical_health": {...},
  "mental_health": {...},
  "emotional_health": {...},
  "energy_levels": {...},
  "recommendations": [...],
  "remedies": [...]
}
```

### GET `/numerology/health/cycles/`
Calculate health cycles.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "current_cycle": {...},
  "physical_cycle": {...},
  "emotional_cycle": {...},
  "intellectual_cycle": {...},
  "recommendations": [...]
}
```

### GET `/numerology/health/risk-periods/`
Get health risk periods.

**Headers:** `Authorization: Bearer {access_token}`

**Query Parameters:**
- `months_ahead` (optional): Number of months to forecast, default 12

**Response:**
```json
{
  "risk_periods": [
    {
      "start_date": "2025-03-01",
      "end_date": "2025-03-15",
      "risk_level": "Medium",
      "areas_of_concern": [...],
      "preventive_measures": [...]
    }
  ]
}
```

### POST `/numerology/health/medical-timing/`
Calculate optimal timing for medical procedures.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "procedure_type": "surgery",
  "start_date": "2025-03-01",
  "end_date": "2025-06-30"
}
```

**Response:**
```json
{
  "best_dates": [...],
  "dates_to_avoid": [...],
  "recovery_periods": [...]
}
```

---

## Spiritual & Predictive

### GET `/numerology/spiritual/`
Get spiritual numerology profile.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "soul_purpose": {...},
  "karmic_lessons": [...],
  "spiritual_gifts": [...],
  "life_mission": "...",
  "spiritual_path": {...}
}
```

### GET `/numerology/spiritual/soul-contracts/`
Get soul contract analysis.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "primary_contract": {...},
  "secondary_contracts": [...],
  "lessons_to_learn": [...],
  "gifts_to_share": [...],
  "soul_group": {...}
}
```

### GET `/numerology/spiritual/karmic-timeline/`
Get karmic timeline.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "past_life_influences": [...],
  "current_life_lessons": [...],
  "future_opportunities": [...],
  "karmic_debts": [...],
  "karmic_rewards": [...]
}
```

### GET `/numerology/predictive/`
Get predictive numerology analysis.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "current_year": {...},
  "upcoming_cycles": [...],
  "major_transitions": [...],
  "opportunities": [...],
  "challenges": [...]
}
```

### GET `/numerology/predictive/9-year-cycle/`
Get 9-year cycle analysis.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "current_year_in_cycle": 3,
  "cycle_overview": {...},
  "year_by_year": [...],
  "key_milestones": [...],
  "recommendations": [...]
}
```

### GET `/numerology/predictive/breakthrough-years/`
Get breakthrough year predictions.

**Headers:** `Authorization: Bearer {access_token}`

**Query Parameters:**
- `years_ahead` (optional): Number of years to forecast, default 10

**Response:**
```json
{
  "breakthrough_years": [
    {
      "year": 2027,
      "score": 95,
      "areas": ["career", "relationships"],
      "opportunities": [...],
      "preparation_tips": [...]
    }
  ]
}
```

---

## Payments & Subscriptions

### POST `/payments/create-subscription/`
Create a new subscription.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "plan": "premium",
  "payment_method_id": "pm_xxx"
}
```

**Response:**
```json
{
  "subscription_id": "sub_xxx",
  "status": "active",
  "current_period_end": "2025-03-01T00:00:00Z"
}
```

### POST `/payments/update-subscription/`
Update existing subscription.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "plan": "enterprise"
}
```

**Response:**
```json
{
  "subscription_id": "sub_xxx",
  "status": "active",
  "plan": "enterprise"
}
```

### POST `/payments/cancel-subscription/`
Cancel subscription.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "message": "Subscription cancelled successfully",
  "ends_at": "2025-03-01T00:00:00Z"
}
```

### GET `/payments/subscription-status/`
Get subscription status.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "status": "active",
  "plan": "premium",
  "current_period_start": "2025-02-01T00:00:00Z",
  "current_period_end": "2025-03-01T00:00:00Z",
  "cancel_at_period_end": false
}
```

### GET `/payments/billing-history/`
Get billing history.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "payments": [
    {
      "id": "uuid",
      "amount": 29.99,
      "currency": "USD",
      "status": "succeeded",
      "created_at": "2025-02-01T00:00:00Z"
    }
  ]
}
```

---

## AI Chat

### POST `/ai/chat/`
Send message to AI assistant.

**Headers:** `Authorization: Bearer {access_token}`

**Request Body:**
```json
{
  "message": "What does my life path number mean?",
  "conversation_id": "uuid" // optional
}
```

**Response:**
```json
{
  "conversation_id": "uuid",
  "message": "Your life path number is 5...",
  "context": {...}
}
```

### GET `/ai/conversations/`
Get list of AI conversations.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "conversations": [
    {
      "id": "uuid",
      "title": "Life Path Discussion",
      "last_message": "...",
      "created_at": "2025-02-01T10:00:00Z"
    }
  ]
}
```

### GET `/ai/conversations/{conversation_id}/messages/`
Get messages from a conversation.

**Headers:** `Authorization: Bearer {access_token}`

**Response:**
```json
{
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "What does my life path number mean?",
      "created_at": "2025-02-01T10:00:00Z"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "Your life path number is 5...",
      "created_at": "2025-02-01T10:00:05Z"
    }
  ]
}
```

---

## Additional Features

### Lo Shu Grid

#### GET `/numerology/lo-shu-grid/`
Get Lo Shu Grid analysis.

#### GET `/numerology/lo-shu-grid/detailed/`
Get detailed Lo Shu Grid with arrows and patterns.

#### GET `/numerology/lo-shu-grid/arrows/`
Get personality arrows from Lo Shu Grid.

#### GET `/numerology/lo-shu-grid/remedies/`
Get remedies for missing numbers.

#### POST `/numerology/lo-shu-grid/compare/`
Compare two Lo Shu Grids.

### Remedies

#### GET `/numerology/remedies/`
Get personalized remedies.

#### POST `/numerology/remedies/{remedy_id}/track/`
Track remedy progress.

#### GET `/numerology/remedies/effectiveness/`
Get remedy effectiveness data.

### People Management

#### GET `/people/`
List all saved people.

#### POST `/people/`
Add a new person.

#### GET `/people/{person_id}/`
Get person details.

#### DELETE `/people/{person_id}/`
Delete a person.

#### POST `/people/{person_id}/calculate/`
Calculate numerology for a person.

### Visualizations

#### GET `/numerology/visualizations/wheel/`
Get numerology wheel visualization data.

#### GET `/numerology/visualizations/timeline/`
Get timeline visualization data.

#### GET `/numerology/visualizations/comparison/`
Get comparison charts data.

---

## Error Responses

All endpoints follow standard error response format:

```json
{
  "error": "Error message description",
  "details": {
    // Optional additional error details
  }
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

---

## Rate Limiting

- **Free tier:** 100 requests per hour
- **Premium tier:** 1000 requests per hour
- **Enterprise tier:** Unlimited

---

## Pagination

List endpoints support pagination with query parameters:

- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)

**Response includes:**
```json
{
  "count": 100,
  "next": "https://api.example.com/endpoint/?page=2",
  "previous": null,
  "results": [...]
}
```

---

## Webhooks

Available webhook events:

- `subscription.created`
- `subscription.updated`
- `subscription.cancelled`
- `payment.succeeded`
- `payment.failed`

Configure webhooks in your account settings.

---

## Support

For API support, contact: support@numerai.com

Documentation version: 1.0.0
Last updated: 2025-02-01
