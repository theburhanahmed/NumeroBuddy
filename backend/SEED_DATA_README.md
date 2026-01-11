# Database Seed Data

This document describes the seed data management command for populating all database tables with test data.

## Overview

The `seed_data` management command seeds all database tables with test data, including:
- Feature flags with real configuration data
- Pricing/subscription data with real prices
- Test users for all subscription tiers
- Complete test data for all tables

## Usage

### Basic Usage

```bash
python manage.py seed_data
```

This will:
1. Run all migrations first (unless skipped)
2. Initialize feature flags with real data
3. Seed all tables with test data

### Options

#### Skip Migrations

If migrations have already been run:

```bash
python manage.py seed_data --skip-migrations
```

#### Clear Existing Data

⚠️ **WARNING**: This will delete all existing data before seeding!

```bash
python manage.py seed_data --clear
```

### Combined Usage

```bash
python manage.py seed_data --skip-migrations --clear
```

## What Gets Seeded

### 1. Feature Flags (Real Data)
- Uses the existing `initialize_feature_flags` command
- Seeds all feature flags with real configuration
- Sets up tier-based access for all features

### 2. Pricing Data (Real Prices)
- Basic: $9.99/month
- Premium: $19.99/month
- Elite: $29.99/month
- Creates subscriptions and payment history for premium users

### 3. Users & Profiles
- Creates test users for each subscription tier (free, basic, premium, elite)
- Creates 10 additional random users
- Creates user profiles with date of birth, gender, location
- All users have password: `testpass123`

### 4. Numerology Data
- Numerology profiles with all core numbers
- Daily readings for the last 7 days
- Remedies with tracking entries
- Compatibility checks
- Person entries with numerology profiles

### 5. Consultations
- 5 experts (one for each specialty)
- Consultations for test users
- Expert availability schedules

### 6. Reports
- Report templates (Basic Birth Chart, Detailed Analysis, Compatibility Report)
- Generated reports for test users

### 7. Rewards & Achievements
- Reward definitions
- Achievement definitions
- Points transactions for test users

### 8. Calendar Data
- Numerology events
- Personal cycles
- Auspicious dates
- Calendar reminders

### 9. Dashboard
- Dashboard widgets
- User activities
- Quick insights

### 10. AI Chat
- AI conversations
- AI messages

### 11. Social
- Connections between users
- Social groups

### 12. Analytics
- User activity logs
- Event tracking

### 13. Knowledge Graph
- Number relationships
- Numerology patterns

## Test Users

The command creates the following test users:

- `free@test.com` - Free tier user (password: `testpass123`)
- `basic@test.com` - Basic tier user (password: `testpass123`)
- `premium@test.com` - Premium tier user (password: `testpass123`)
- `elite@test.com` - Elite tier user (password: `testpass123`)
- `user0@test.com` through `user9@test.com` - Additional test users

## Important Notes

1. **Migrations**: The command runs migrations automatically unless `--skip-migrations` is used
2. **Feature Flags**: Real feature flag data is initialized using the existing command
3. **Pricing**: Real pricing data from `payments/services.py` is used
4. **Transactions**: All seeding is wrapped in a database transaction for safety
5. **Clear Option**: Use `--clear` carefully as it deletes all existing data

## Troubleshooting

### ModuleNotFoundError: No module named 'graphene_django'

If you see this error, it's a dependency issue, not related to the seed command. Install missing dependencies:

```bash
pip install -r requirements.txt
```

### Migration Errors

If migrations fail, you can skip them:

```bash
python manage.py seed_data --skip-migrations
```

### Data Already Exists

If you want to start fresh:

```bash
python manage.py seed_data --clear
```

## Integration with CI/CD

This command can be used in CI/CD pipelines to set up test databases:

```bash
python manage.py migrate
python manage.py seed_data --skip-migrations
```
