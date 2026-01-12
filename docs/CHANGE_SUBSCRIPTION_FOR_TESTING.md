# How to Change User Subscription Plan for Testing

This guide explains how to change a user's subscription plan from the backend for testing purposes.

## Important Notes

The system checks subscription status in this order:
1. **Subscription model** - If user has a `Subscription` record with `status='active'`, it uses `subscription.plan`
2. **User model** - Falls back to `user.subscription_plan` field

To properly set a user as premium, you need to update **both**:
- `User.subscription_plan` field
- `User.is_premium` field (set to `True` for paid plans)
- `Subscription` model (if exists) with `status='active'` and matching `plan`

---

## Method 1: Using Django Management Command (Recommended)

The easiest way to change a subscription for testing.

### Steps:

1. **Open terminal** and navigate to your backend directory:
   ```bash
   cd backend
   ```

2. **Run the command**:
   ```bash
   python manage.py change_subscription <user_email_or_id> <plan> [options]
   ```

### Examples:

**Set user to Premium plan:**
```bash
python manage.py change_subscription user@example.com premium
```

**Set user to Basic plan with active status:**
```bash
python manage.py change_subscription user@example.com basic --status active
```

**Set user to Elite plan with 60 days expiry:**
```bash
python manage.py change_subscription user@example.com elite --days 60
```

**Set user back to Free plan:**
```bash
python manage.py change_subscription user@example.com free
```

**Using user UUID instead of email:**
```bash
python manage.py change_subscription 123e4567-e89b-12d3-a456-426614174000 premium
```

### Available Options:

- `--status`: Subscription status (`active`, `canceled`, `trialing`, `incomplete`) - Default: `active`
- `--days`: Number of days for premium expiry - Default: `30`

---

## Method 2: Using Django Admin Panel

### Steps:

1. **Access Django Admin**:
   - Go to `http://localhost:8000/admin/` (or your admin URL)
   - Login with superuser credentials

2. **Option A: Change via User Admin** (Recommended)
   - Navigate to **Users** → Select the user
   - In the **Subscription & Status** section:
     - Change `subscription_plan` dropdown (free, basic, premium, elite)
     - Ensure `is_premium` is checked for paid plans
     - Optionally set `premium_expiry` date
   - Click **Save**
   - The system will automatically sync with Subscription model if it exists

3. **Option B: Change via Subscription Admin**
   - Navigate to **Subscriptions** → Select the subscription
   - In the **Subscription Details** section:
     - Change `plan` dropdown (basic, premium, elite)
     - Set `status` to `active`
     - Set `current_period_start` and `current_period_end` dates
   - Click **Save**
   - The system will automatically sync with User model

4. **Bulk Actions** (for multiple users):
   - In **Users** list, select multiple users
   - Use dropdown actions:
     - "Set selected users to Free plan"
     - "Set selected users to Basic plan"
     - "Set selected users to Premium plan"
     - "Set selected users to Elite plan"
   - Click **Go**

---

## Method 3: Using Django Shell

For programmatic access or scripts.

### Steps:

1. **Open Django shell**:
   ```bash
   cd backend
   python manage.py shell
   ```

2. **Run the following code**:

```python
from accounts.models import User
from payments.models import Subscription
from django.utils import timezone
from datetime import timedelta

# Find user (replace with actual email/phone/UUID)
user = User.objects.get(email='user@example.com')
# Or: user = User.objects.get(id='user-uuid-here')

# Set plan (free, basic, premium, elite)
plan = 'premium'  # Change this to desired plan

# Update User model
user.subscription_plan = plan
user.is_premium = plan in ['basic', 'premium', 'elite']

if plan in ['basic', 'premium', 'elite']:
    user.premium_expiry = timezone.now() + timedelta(days=30)
else:
    user.premium_expiry = None

user.save(update_fields=['subscription_plan', 'is_premium', 'premium_expiry'])
print(f"✓ Updated User: {user.email} - plan={plan}, is_premium={user.is_premium}")

# Update or create Subscription model
if plan in ['basic', 'premium', 'elite']:
    subscription, created = Subscription.objects.get_or_create(
        user=user,
        defaults={
            'plan': plan,
            'status': 'active',
            'current_period_start': timezone.now(),
            'current_period_end': timezone.now() + timedelta(days=30),
        }
    )
    
    if not created:
        subscription.plan = plan
        subscription.status = 'active'
        subscription.current_period_start = timezone.now()
        subscription.current_period_end = timezone.now() + timedelta(days=30)
        subscription.cancel_at_period_end = False
        subscription.save()
    
    print(f"✓ Updated Subscription: plan={plan}, status=active")
else:
    # For free plan, cancel existing subscription
    if hasattr(user, 'subscription'):
        user.subscription.status = 'canceled'
        user.subscription.save(update_fields=['status'])
        print("✓ Canceled existing subscription")

print(f"\n✓ Successfully changed subscription to {plan.upper()} plan!")
```

---

## Method 4: Direct Database Update (Not Recommended)

Only use this if you have direct database access and understand the implications.

### Steps:

1. **Connect to your database** (PostgreSQL in this case)

2. **Update User table**:
   ```sql
   UPDATE users 
   SET subscription_plan = 'premium', 
       is_premium = TRUE,
       premium_expiry = NOW() + INTERVAL '30 days'
   WHERE email = 'user@example.com';
   ```

3. **Update or Insert Subscription table**:
   ```sql
   -- Check if subscription exists
   SELECT id FROM subscriptions WHERE user_id = (SELECT id FROM users WHERE email = 'user@example.com');
   
   -- If exists, update it
   UPDATE subscriptions 
   SET plan = 'premium', 
       status = 'active',
       current_period_start = NOW(),
       current_period_end = NOW() + INTERVAL '30 days'
   WHERE user_id = (SELECT id FROM users WHERE email = 'user@example.com');
   
   -- If doesn't exist, insert it (you'll need the user UUID)
   INSERT INTO subscriptions (id, user_id, plan, status, current_period_start, current_period_end, created_at, updated_at)
   VALUES (
       gen_random_uuid(),
       (SELECT id FROM users WHERE email = 'user@example.com'),
       'premium',
       'active',
       NOW(),
       NOW() + INTERVAL '30 days',
       NOW(),
       NOW()
   );
   ```

---

## Verification

After changing the subscription, verify it worked:

### 1. Check via Django Shell:
```python
from accounts.models import User
from numerology.subscription_utils import get_user_subscription_tier

user = User.objects.get(email='user@example.com')
print(f"User subscription_plan: {user.subscription_plan}")
print(f"User is_premium: {user.is_premium}")
print(f"Subscription tier (what system uses): {get_user_subscription_tier(user)}")
```

### 2. Check via API:
```bash
# Get user profile (requires authentication)
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/v1/accounts/profile/

# Check subscription status
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/v1/payments/subscription-status/
```

### 3. Check in Admin Panel:
- Go to Users → Find user → Check `subscription_plan` and `is_premium` fields
- Go to Subscriptions → Find subscription → Check `plan` and `status` fields

---

## Troubleshooting

### Issue: User still shows as free after update

**Solution:**
1. Ensure `is_premium` is set to `True` for paid plans
2. If Subscription exists, ensure `status='active'`
3. Check that `subscription_plan` matches the Subscription `plan`
4. Clear any caches if applicable

### Issue: Subscription tier not updating

**Solution:**
The system uses `get_user_subscription_tier()` which:
1. First checks Subscription with `status='active'`
2. Falls back to `user.subscription_plan`

Make sure both are updated correctly.

### Issue: Features still not accessible

**Solution:**
1. Verify the subscription tier using the verification steps above
2. Check feature flags configuration in `numerology/constants.py`
3. Ensure the feature is enabled for that tier
4. Restart the Django server if needed

---

## Quick Reference

| Plan | subscription_plan | is_premium | Subscription.status | Subscription.plan |
|------|-------------------|------------|---------------------|-------------------|
| Free | `free` | `False` | `canceled` (or no record) | N/A |
| Basic | `basic` | `True` | `active` | `basic` |
| Premium | `premium` | `True` | `active` | `premium` |
| Elite | `elite` | `True` | `active` | `elite` |

---

## Summary

**Recommended approach for testing:**
1. Use the management command: `python manage.py change_subscription user@example.com premium`
2. Or use Django Admin panel with the bulk actions
3. Verify using the verification steps above

The management command handles all the complexity automatically and ensures both User and Subscription models are properly synced.
