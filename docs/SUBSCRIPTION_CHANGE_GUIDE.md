# How to Change a User's Subscription Plan (Simplified)

## Terminology

| Term | Meaning |
|------|---------|
| **Plan** | Tier of access: `free`, `basic`, `premium`, or `elite` |
| **Period** | Billing period — when the user is charged and when access ends |
| **Trial period** | Free access before first payment (`trial_start` → `trial_end`) |
| **Trailing period** | After cancellation, user keeps access until `current_period_end` (`cancel_at_period_end=True`) |

---

## When to Use Each Method

| Scenario | Method |
|----------|--------|
| **Testing / Development** (local DB only) | Management command |
| **Admin adjustments** (single user, GUI) | Django Admin |
| **Production** (real Stripe billing) | Stripe Dashboard or API |

---

## Method 1: Management Command (Recommended for Testing)

### Change plan + period length

```bash
cd backend
python manage.py change_subscription <email_or_id> <plan> [--days 30]
```

**Examples:**

```bash
# Set user to Premium for 30 days (default)
python manage.py change_subscription user@example.com premium

# Set user to Elite for 60 days
python manage.py change_subscription user@example.com elite --days 60

# Set user to Basic
python manage.py change_subscription user@example.com basic

# Set user back to Free
python manage.py change_subscription user@example.com free
```

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `--days` | 30 | Period length in days (used for `current_period_end`) |
| `--status` | active | `active`, `trialing`, `canceled`, or `incomplete` |
| `--trailing` | - | Set `cancel_at_period_end=True` (user keeps access until period end) |
| `--trial-days` | - | Start a trial: `status=trialing`, set `trial_end` |

### Trailing period (cancel but keep access until period end)

```bash
# User cancels but keeps access until period end
python manage.py change_subscription user@example.com premium --trailing
```

### Trial period (free access before billing)

```bash
# 14-day trial, then converts to paid
python manage.py change_subscription user@example.com premium --status trialing --trial-days 14 --days 30
```

---

## Method 2: Django Admin

1. Go to `/admin/`
2. Open **Subscriptions** → select the user’s subscription
3. Edit:
   - **plan** → basic / premium / elite
   - **status** → active / trialing / canceled
   - **current_period_start** / **current_period_end** → period dates
   - **cancel_at_period_end** → check for trailing period
   - **trial_start** / **trial_end** → trial dates
4. Click **Save** (User model is synced automatically)

---

## Method 3: Production (Stripe-Backed Subscriptions)

If the subscription has a `stripe_subscription_id`, changes in Django can be overwritten by Stripe webhooks. Prefer Stripe for billing changes.

### Plan changes

1. **Stripe Dashboard**: Customers → select user → Subscription → Update plan
2. **API**: `POST /api/v1/payments/update-subscription/` with `{"plan": "premium"}` (authenticated user)

### Trailing period (cancel at period end)

1. **Stripe Dashboard**: Customers → Subscription → Cancel subscription → “Cancel at period end”
2. **API**: `POST /api/v1/payments/update-subscription/` with `{"cancel_at_period_end": true}`

---

## Quick Reference: What Gets Updated

| Action | User model | Subscription model |
|--------|------------|---------------------|
| Change plan | `subscription_plan`, `is_premium` | `plan`, `status` |
| Set period | `premium_expiry` | `current_period_start`, `current_period_end` |
| Trailing period | - | `cancel_at_period_end=True` |
| Trial period | - | `trial_start`, `trial_end`, `status=trialing` |

---

## Verification

```bash
# Django shell
python manage.py shell
```

```python
from accounts.models import User
from numerology.subscription_utils import get_user_subscription_tier

user = User.objects.get(email='user@example.com')
print(get_user_subscription_tier(user))  # Should show: free, basic, premium, or elite
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| User still shows as free | Ensure `is_premium=True` and Subscription `status='active'` (or `trialing`) |
| Stripe overwrites changes | Use Stripe Dashboard for subscriptions with `stripe_subscription_id` |
| Trial user has no access | Set `status='trialing'` and `user.subscription_plan` to the paid plan |
