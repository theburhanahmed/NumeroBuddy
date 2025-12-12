# Environment Variables Setup Guide

This guide explains the environment variables that need to be configured for NumerAI.

## Files Created

### Backend
- **`backend/.env.example`** - Template file (safe to commit to git)
- **`backend/.env`** - Your actual environment file (DO NOT commit to git)

### Frontend
- **`frontend/.env.local.example`** - Template file (safe to commit to git)
- **`frontend/.env.local`** - Your actual environment file (DO NOT commit to git)

## Quick Start

1. **Backend**: The `.env` file in the `backend/` folder has been created with placeholder values
2. **Frontend**: The `.env.local` file in the `frontend/` folder has been created with placeholder values

## What You Need to Update

### Backend (.env) - Required Variables

#### Critical (Must Update):
- ✅ **SECRET_KEY** - Generate a new Django secret key for production
- ✅ **DB_PASSWORD** - Your PostgreSQL database password
- ✅ **STRIPE_SECRET_KEY** - Your Stripe secret key from https://dashboard.stripe.com/apikeys
- ✅ **STRIPE_PUBLISHABLE_KEY** - Your Stripe publishable key
- ✅ **STRIPE_WEBHOOK_SECRET** - Your Stripe webhook secret
- ✅ **GOOGLE_OAUTH_CLIENT_ID** - Google OAuth client ID
- ✅ **GOOGLE_OAUTH_CLIENT_SECRET** - Google OAuth client secret

#### Production Settings (Update for production):
- **ALLOWED_HOSTS** - Your domain names
- **CORS_ALLOWED_ORIGINS** - Your frontend URL
- **FRONTEND_URL** - Your frontend URL
- **EMAIL_BACKEND** - Change to SMTP for production
- **EMAIL_HOST_USER** - Your email service credentials
- **EMAIL_HOST_PASSWORD** - Your email service password

#### Optional:
- **REDIS_URL** - Only if using Redis (defaults provided)
- **CELERY_BROKER_URL** - Only if using Celery (defaults provided)
- **FIREBASE_CREDENTIALS_PATH** - Only if using push notifications

### Frontend (.env.local) - Required Variables

#### Critical (Must Update):
- ✅ **NEXT_PUBLIC_API_URL** - Your backend API URL
  - Development: `http://localhost:8000/api/v1`
  - Production: `https://your-backend-domain.com/api/v1`
- ✅ **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY** - Your Stripe publishable key
- ✅ **NEXT_PUBLIC_GOOGLE_CLIENT_ID** - Google OAuth client ID

## Setup Instructions

### 1. Generate Django Secret Key

```bash
cd backend
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copy the output and update `SECRET_KEY` in `backend/.env`.

### 2. Set Up Database

Make sure PostgreSQL is running and create a database:

```bash
# Create database
createdb numerai

# Or using psql
psql -U postgres
CREATE DATABASE numerai;
CREATE USER numerai WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE numerai TO numerai;
```

Update database credentials in `backend/.env`.

### 3. Set Up Stripe

1. Go to https://dashboard.stripe.com/apikeys
2. Get your test API keys
3. Create products and prices for Basic, Premium, and Elite plans
4. Update the following in `backend/.env`:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_PRICE_ID_BASIC`
   - `STRIPE_PRICE_ID_PREMIUM`
   - `STRIPE_PRICE_ID_ELITE`
5. Update in `frontend/.env.local`:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### 4. Set Up Google OAuth

1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - Development: `http://localhost:3000/auth/google/callback`
   - Production: `https://your-domain.com/auth/google/callback`
4. Update in both `backend/.env` and `frontend/.env.local`:
   - `GOOGLE_OAUTH_CLIENT_ID`
   - `GOOGLE_OAUTH_CLIENT_SECRET` (backend only)

### 5. Configure Email (Production Only)

For production, set up an email service (SendGrid, AWS SES, etc.):

```bash
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_HOST_USER=your-api-key
EMAIL_HOST_PASSWORD=your-password
```

## Development vs Production

### Development
- Use test Stripe keys (`sk_test_...`, `pk_test_...`)
- Use console email backend
- Use localhost URLs
- Set `DEBUG=True`

### Production
- Use live Stripe keys (`sk_live_...`, `pk_live_...`)
- Use SMTP email backend
- Use production domain URLs
- Set `DEBUG=False`
- Generate a secure `SECRET_KEY`

## Important Notes

- ⚠️ **NEVER commit `.env` or `.env.local` files to git**
- ✅ **DO commit `.env.example` and `.env.local.example` files**
- 🔒 Keep all secrets secure and never share them publicly
- 🔄 Restart your servers after updating environment variables

## Verification

After updating the environment variables:

### Backend
```bash
cd backend
python manage.py check
```

### Frontend
```bash
cd frontend
npm run dev
```

Check the console for any missing environment variable errors.
