# NumerAI - Production Configuration Checklist
**Date:** December 2025  
**Status:** Pre-Production Configuration Guide  
**Estimated Time:** 1-2 days

---

## 📋 Overview

This checklist covers all configuration steps required to deploy NumerAI to production. Follow each section sequentially and check off items as you complete them.

**Prerequisites:**
- ✅ Code is 95% complete (all features implemented)
- ✅ All tests passing locally
- ✅ Database migrations ready
- ✅ Production hosting platform selected (Render, AWS, etc.)

---

## 🔐 1. Stripe Payment Integration Configuration

### 1.1 Stripe Account Setup
- [ ] Create Stripe account at https://stripe.com
- [ ] Complete business verification
- [ ] Add business information (name, address, tax ID)
- [ ] Verify email address
- [ ] Set up two-factor authentication (2FA)
- [ ] Review and accept Stripe Terms of Service

### 1.2 Stripe API Keys
- [ ] Navigate to Stripe Dashboard → Developers → API keys
- [ ] Copy **Publishable Key** (starts with `pk_live_...`)
- [ ] Copy **Secret Key** (starts with `sk_live_...`)
- [ ] **Save keys securely** (use password manager)
- [ ] Enable **Test Mode** for initial testing
- [ ] Copy **Test Publishable Key** (`pk_test_...`)
- [ ] Copy **Test Secret Key** (`sk_test_...`)

### 1.3 Stripe Product & Price Setup
- [ ] Navigate to Stripe Dashboard → Products
- [ ] Create **Basic Plan** product:
  - [ ] Name: "NumerAI Basic Plan"
  - [ ] Description: "Basic numerology features"
  - [ ] Create recurring price: ₹499/month (or equivalent)
  - [ ] Copy **Price ID** (starts with `price_...`)
  - [ ] Save as `STRIPE_PRICE_ID_BASIC`

- [ ] Create **Premium Plan** product:
  - [ ] Name: "NumerAI Premium Plan"
  - [ ] Description: "Premium numerology features"
  - [ ] Create recurring price: ₹999/month (or equivalent)
  - [ ] Copy **Price ID**
  - [ ] Save as `STRIPE_PRICE_ID_PREMIUM`

- [ ] Create **Elite Plan** product:
  - [ ] Name: "NumerAI Elite Plan"
  - [ ] Description: "Elite numerology features"
  - [ ] Create recurring price: ₹1999/month (or equivalent)
  - [ ] Copy **Price ID**
  - [ ] Save as `STRIPE_PRICE_ID_ELITE`

### 1.4 Stripe Webhook Configuration
- [ ] Navigate to Stripe Dashboard → Developers → Webhooks
- [ ] Click **"Add endpoint"**
- [ ] Enter webhook URL: `https://your-backend-domain.com/api/v1/payments/webhook/`
- [ ] Select events to listen to:
  - [ ] `payment_intent.succeeded`
  - [ ] `payment_intent.payment_failed`
  - [ ] `customer.subscription.created`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.payment_succeeded`
  - [ ] `invoice.payment_failed`
  - [ ] `charge.refunded`
- [ ] Click **"Add endpoint"**
- [ ] Copy **Webhook Signing Secret** (starts with `whsec_...`)
- [ ] **Save webhook secret securely**

### 1.5 Stripe Environment Variables (Backend)
Add to your production environment:
```bash
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
STRIPE_PRICE_ID_BASIC=price_xxxxxxxxxxxxx
STRIPE_PRICE_ID_PREMIUM=price_xxxxxxxxxxxxx
STRIPE_PRICE_ID_ELITE=price_xxxxxxxxxxxxx
```

- [ ] Add `STRIPE_SECRET_KEY` to backend environment
- [ ] Add `STRIPE_PUBLISHABLE_KEY` to backend environment
- [ ] Add `STRIPE_WEBHOOK_SECRET` to backend environment
- [ ] Add `STRIPE_PRICE_ID_BASIC` to backend environment
- [ ] Add `STRIPE_PRICE_ID_PREMIUM` to backend environment
- [ ] Add `STRIPE_PRICE_ID_ELITE` to backend environment

### 1.6 Stripe Environment Variables (Frontend)
Add to your production environment:
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
```

- [ ] Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to frontend environment
- [ ] Verify key is accessible in browser (check Network tab)

### 1.7 Stripe Testing
- [ ] Test payment flow with test card: `4242 4242 4242 4242`
- [ ] Test subscription creation
- [ ] Test subscription cancellation
- [ ] Test subscription update
- [ ] Verify webhook receives events
- [ ] Check webhook logs in Stripe Dashboard
- [ ] Test failed payment handling
- [ ] Test refund flow (if applicable)

---

## 🔑 2. Google OAuth Configuration

### 2.1 Google Cloud Console Setup
- [ ] Go to https://console.cloud.google.com
- [ ] Create new project or select existing project
- [ ] Project name: "NumerAI Production"
- [ ] Enable billing (if required)
- [ ] Note project ID for reference

### 2.2 OAuth Consent Screen Configuration
- [ ] Navigate to APIs & Services → OAuth consent screen
- [ ] Select **External** user type
- [ ] Fill in application information:
  - [ ] App name: "NumerAI"
  - [ ] User support email: your-email@example.com
  - [ ] App logo: upload NumerAI logo (optional)
  - [ ] Application home page: `https://your-frontend-domain.com`
  - [ ] Privacy policy URL: `https://your-frontend-domain.com/privacy-policy`
  - [ ] Terms of service URL: `https://your-frontend-domain.com/terms-of-service`
- [ ] Add scopes:
  - [ ] `email`
  - [ ] `profile`
  - [ ] `openid`
- [ ] Add test users (for testing before verification)
- [ ] Save and continue

### 2.3 OAuth Credentials Creation
- [ ] Navigate to APIs & Services → Credentials
- [ ] Click **"Create Credentials"** → **"OAuth client ID"**
- [ ] Application type: **Web application**
- [ ] Name: "NumerAI Web Client"
- [ ] Authorized JavaScript origins:
  - [ ] `https://your-frontend-domain.com`
  - [ ] `http://localhost:3000` (for local testing)
- [ ] Authorized redirect URIs:
  - [ ] `https://your-frontend-domain.com/auth/google/callback`
  - [ ] `http://localhost:3000/auth/google/callback` (for local testing)
- [ ] Click **"Create"**
- [ ] Copy **Client ID** (starts with `...apps.googleusercontent.com`)
- [ ] Copy **Client Secret**
- [ ] **Save credentials securely**

### 2.4 Google OAuth Environment Variables (Backend)
Add to your production environment:
```bash
GOOGLE_OAUTH_CLIENT_ID=xxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
```

- [ ] Add `GOOGLE_OAUTH_CLIENT_ID` to backend environment
- [ ] Add `GOOGLE_OAUTH_CLIENT_SECRET` to backend environment

### 2.5 Google OAuth Environment Variables (Frontend)
Add to your production environment:
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxxxxxxxxxx.apps.googleusercontent.com
```

- [ ] Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to frontend environment
- [ ] Verify Google Sign-In button appears on login/register pages

### 2.6 Google OAuth Testing
- [ ] Test Google Sign-In button on login page
- [ ] Test Google Sign-In button on register page
- [ ] Complete OAuth flow:
  - [ ] Click Google Sign-In button
  - [ ] Redirected to Google consent screen
  - [ ] Grant permissions
  - [ ] Redirected back to app
  - [ ] User is logged in
  - [ ] User profile created/updated
- [ ] Test with different Google accounts
- [ ] Verify JWT tokens are generated correctly

### 2.7 OAuth App Verification (Optional - for production)
- [ ] Submit app for verification (if using sensitive scopes)
- [ ] Complete verification process
- [ ] Wait for Google approval (can take 1-2 weeks)

---

## 🔥 3. Firebase Cloud Messaging (FCM) Configuration

### 3.1 Firebase Project Setup
- [ ] Go to https://console.firebase.google.com
- [ ] Create new project or select existing project
- [ ] Project name: "NumerAI"
- [ ] Enable Google Analytics (optional)
- [ ] Complete project creation

### 3.2 Firebase Web App Registration
- [ ] Navigate to Project Settings → General
- [ ] Scroll to "Your apps" section
- [ ] Click **"Add app"** → Web icon (`</>`)
- [ ] App nickname: "NumerAI Web"
- [ ] Register app
- [ ] Copy **Firebase configuration**:
  ```javascript
  {
    apiKey: "AIza...",
    authDomain: "numerai.firebaseapp.com",
    projectId: "numerai",
    storageBucket: "numerai.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
  }
  ```

### 3.3 Firebase Cloud Messaging Setup
- [ ] Navigate to Project Settings → Cloud Messaging
- [ ] Generate new key pair (if not exists)
- [ ] Copy **Web Push certificates** (VAPID key)
- [ ] Copy **Server key** (Legacy - for backend)
- [ ] **Save keys securely**

### 3.4 Firebase Environment Variables (Frontend)
Add to your production environment:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=numerai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=numerai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=numerai.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_VAPID_KEY=xxxxxxxxxxxxx
```

- [ ] Add all Firebase config variables to frontend environment
- [ ] Verify Firebase is initialized correctly in app

### 3.5 Firebase Environment Variables (Backend)
Add to your production environment:
```bash
FIREBASE_SERVER_KEY=AAAAxxxxxxxxxxxxx
FIREBASE_PROJECT_ID=numerai
```

- [ ] Add `FIREBASE_SERVER_KEY` to backend environment
- [ ] Add `FIREBASE_PROJECT_ID` to backend environment

### 3.6 Firebase Testing
- [ ] Test push notification registration
- [ ] Send test notification from backend
- [ ] Verify notification received in browser
- [ ] Test notification click handling
- [ ] Test notification permissions

---

## 🗄️ 4. Database Configuration

### 4.1 PostgreSQL Production Database
- [ ] Create production PostgreSQL database
- [ ] Database name: `numerai_production`
- [ ] Create database user: `numerai_user`
- [ ] Set strong password for database user
- [ ] Grant all privileges to user
- [ ] Note connection details:
  - [ ] Host: `your-db-host.com`
  - [ ] Port: `5432`
  - [ ] Database: `numerai_production`
  - [ ] User: `numerai_user`
  - [ ] Password: `[saved securely]`

### 4.2 Database Connection String
- [ ] Format connection string:
  ```
  postgresql://numerai_user:password@host:5432/numerai_production
  ```
- [ ] Or use individual variables:
  ```bash
  DB_NAME=numerai_production
  DB_USER=numerai_user
  DB_PASSWORD=xxxxxxxxxxxxx
  DB_HOST=your-db-host.com
  DB_PORT=5432
  ```

### 4.3 Database Environment Variables (Backend)
Add to your production environment:
```bash
DATABASE_URL=postgresql://user:password@host:5432/dbname
# OR
DB_NAME=numerai_production
DB_USER=numerai_user
DB_PASSWORD=xxxxxxxxxxxxx
DB_HOST=your-db-host.com
DB_PORT=5432
```

- [ ] Add database connection variables
- [ ] Test database connection from backend

### 4.4 Database Migrations
- [ ] Run migrations: `python manage.py migrate`
- [ ] Verify all migrations applied successfully
- [ ] Check for migration errors
- [ ] Create superuser: `python manage.py createsuperuser`
- [ ] Verify superuser can login to admin panel

### 4.5 Database Backup Configuration
- [ ] Set up automated daily backups
- [ ] Configure backup retention (30 days recommended)
- [ ] Test backup restoration process
- [ ] Document backup location and access

---

## 🔴 5. Redis Configuration

### 5.1 Redis Production Instance
- [ ] Create production Redis instance
- [ ] Redis instance name: `numerai-redis-production`
- [ ] Select appropriate plan (based on expected load)
- [ ] Note connection details:
  - [ ] Host: `your-redis-host.com`
  - [ ] Port: `6379` (or custom)
  - [ ] Password: `[saved securely]`

### 5.2 Redis Connection String
- [ ] Format connection string:
  ```
  redis://:password@host:6379/0
  ```
  Or for Redis with SSL:
  ```
  rediss://:password@host:6379/0
  ```

### 5.3 Redis Environment Variables (Backend)
Add to your production environment:
```bash
REDIS_URL=redis://:password@host:6379/0
CELERY_BROKER_URL=redis://:password@host:6379/0
CELERY_RESULT_BACKEND=redis://:password@host:6379/0
```

- [ ] Add `REDIS_URL` to backend environment
- [ ] Add `CELERY_BROKER_URL` to backend environment
- [ ] Add `CELERY_RESULT_BACKEND` to backend environment
- [ ] Test Redis connection from backend

---

## ⚙️ 6. Core Application Environment Variables

### 6.1 Django Settings (Backend)
```bash
# Django Core
SECRET_KEY=your-super-secret-key-min-50-chars
DEBUG=False
ALLOWED_HOSTS=your-backend-domain.com,www.your-backend-domain.com
DJANGO_SETTINGS_MODULE=numerai.settings.production

# API Configuration
API_VERSION=v1
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# Security
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_BROWSER_XSS_FILTER=True
SECURE_CONTENT_TYPE_NOSNIFF=True
X_FRAME_OPTIONS=DENY
```

- [ ] Generate strong `SECRET_KEY` (use: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
- [ ] Set `DEBUG=False` for production
- [ ] Add all backend domains to `ALLOWED_HOSTS`
- [ ] Add frontend domain to `CORS_ALLOWED_ORIGINS`
- [ ] Enable all security settings

### 6.2 Frontend Configuration
```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/v1

# Environment
NODE_ENV=production
```

- [ ] Add `NEXT_PUBLIC_API_URL` to frontend environment
- [ ] Set `NODE_ENV=production`

### 6.3 OpenAI Configuration (Backend)
```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

- [ ] Add OpenAI API key to backend environment
- [ ] Verify API key has sufficient credits
- [ ] Test AI chat functionality

### 6.4 Email Configuration (Backend)
```bash
# SMTP Configuration (using Gmail as example)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@your-domain.com
SERVER_EMAIL=server@your-domain.com

# OR use SendGrid
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=SG.xxxxxxxxxxxxx
DEFAULT_FROM_EMAIL=noreply@your-domain.com
```

- [ ] Configure email backend
- [ ] Add email credentials
- [ ] Test email sending (OTP, password reset)
- [ ] Verify emails are received

---

## 🌐 7. Domain & SSL Configuration

### 7.1 Domain Setup
- [ ] Purchase domain (if not already owned)
- [ ] Configure DNS records:
  - [ ] A record for backend: `api.your-domain.com` → Backend IP
  - [ ] A record for frontend: `your-domain.com` → Frontend IP
  - [ ] CNAME for www: `www.your-domain.com` → `your-domain.com`

### 7.2 SSL Certificate
- [ ] Enable SSL/TLS on hosting platform
- [ ] Verify SSL certificate is valid
- [ ] Test HTTPS access:
  - [ ] Backend: `https://api.your-domain.com`
  - [ ] Frontend: `https://your-domain.com`
- [ ] Check SSL grade (use SSL Labs: https://www.ssllabs.com/ssltest/)
- [ ] Ensure certificate auto-renewal is enabled

### 7.3 Update Environment Variables
- [ ] Update `ALLOWED_HOSTS` with production domain
- [ ] Update `CORS_ALLOWED_ORIGINS` with production frontend URL
- [ ] Update `NEXT_PUBLIC_API_URL` with production backend URL
- [ ] Update OAuth redirect URIs in Google Console
- [ ] Update Stripe webhook URL

---

## 📊 8. Monitoring & Logging Configuration

### 8.1 Application Logging
- [ ] Configure log levels (INFO for production)
- [ ] Set up log rotation
- [ ] Configure log storage location
- [ ] Set up log aggregation (if using external service)

### 8.2 Error Tracking (Optional - Recommended)
- [ ] Set up Sentry account (https://sentry.io)
- [ ] Install Sentry SDK in backend
- [ ] Install Sentry SDK in frontend
- [ ] Add Sentry DSN to environment:
  ```bash
  SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
  ```
- [ ] Test error reporting

### 8.3 Performance Monitoring (Optional)
- [ ] Set up application performance monitoring (APM)
- [ ] Configure uptime monitoring
- [ ] Set up alerting for:
  - [ ] High error rates
  - [ ] Slow response times
  - [ ] Service downtime
  - [ ] High resource usage

### 8.4 Analytics (Optional)
- [ ] Set up Google Analytics
- [ ] Add tracking ID to frontend:
  ```bash
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
  ```
- [ ] Verify tracking is working

---

## 🔒 9. Security Configuration

### 9.1 Security Headers
- [ ] Verify security headers are set:
  - [ ] Content-Security-Policy
  - [ ] X-Frame-Options
  - [ ] X-Content-Type-Options
  - [ ] Strict-Transport-Security
  - [ ] Referrer-Policy

### 9.2 Rate Limiting
- [ ] Configure rate limiting for API endpoints
- [ ] Set appropriate limits:
  - [ ] Authentication endpoints: 5 requests/minute
  - [ ] AI chat: 10 requests/minute
  - [ ] General API: 100 requests/minute
- [ ] Test rate limiting works correctly

### 9.3 API Security
- [ ] Verify JWT token expiration (15 minutes access, 7 days refresh)
- [ ] Test token refresh mechanism
- [ ] Verify invalid tokens are rejected
- [ ] Test CORS restrictions

### 9.4 Data Protection
- [ ] Verify sensitive data is encrypted at rest
- [ ] Verify passwords are hashed (not plain text)
- [ ] Verify database backups are encrypted
- [ ] Review GDPR compliance:
  - [ ] Data export functionality works
  - [ ] Account deletion works
  - [ ] Privacy policy is accessible

---

## 🧪 10. Pre-Production Testing

### 10.1 Backend API Testing
- [ ] Health check endpoint: `GET /api/v1/health/`
- [ ] User registration flow
- [ ] OTP verification
- [ ] User login
- [ ] Profile management
- [ ] Numerology calculations
- [ ] AI chat functionality
- [ ] Payment subscription creation
- [ ] Payment webhook handling
- [ ] Google OAuth flow
- [ ] Push notification sending

### 10.2 Frontend Testing
- [ ] Landing page loads
- [ ] Login page functional
- [ ] Register page functional
- [ ] Dashboard loads after login
- [ ] Profile page functional
- [ ] Birth chart displays correctly
- [ ] AI chat interface works
- [ ] Subscription page loads
- [ ] Payment form works
- [ ] Google Sign-In button works
- [ ] Notifications display correctly

### 10.3 Integration Testing
- [ ] End-to-end user registration
- [ ] End-to-end payment flow
- [ ] End-to-end Google OAuth
- [ ] End-to-end report generation
- [ ] End-to-end AI chat
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness testing

### 10.4 Performance Testing
- [ ] API response times < 2 seconds
- [ ] Frontend load time < 3 seconds
- [ ] Database query optimization
- [ ] Image optimization
- [ ] Bundle size optimization

### 10.5 Security Testing
- [ ] SQL injection prevention
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Authentication bypass attempts
- [ ] Rate limiting enforcement

---

## 📝 11. Documentation & Handoff

### 11.1 Environment Variables Documentation
- [ ] Document all environment variables
- [ ] Create `.env.example` files (without secrets)
- [ ] Document where each variable is used
- [ ] Store production secrets securely (password manager)

### 11.2 Deployment Documentation
- [ ] Document deployment process
- [ ] Document rollback procedure
- [ ] Document common issues and solutions
- [ ] Create runbook for operations team

### 11.3 API Documentation
- [ ] Verify API documentation is accessible
- [ ] Test Swagger/OpenAPI UI
- [ ] Document any custom endpoints
- [ ] Document rate limits

### 11.4 Team Handoff
- [ ] Share production credentials securely
- [ ] Provide access to monitoring dashboards
- [ ] Train team on deployment process
- [ ] Set up on-call rotation (if applicable)

---

## ✅ 12. Final Verification Checklist

### 12.1 All Services Running
- [ ] Backend service is live
- [ ] Frontend service is live
- [ ] Database is accessible
- [ ] Redis is accessible
- [ ] Celery worker is running
- [ ] All services show healthy status

### 12.2 All Features Working
- [ ] User registration ✅
- [ ] User login ✅
- [ ] Profile management ✅
- [ ] Numerology calculations ✅
- [ ] Birth chart display ✅
- [ ] AI chat ✅
- [ ] Payment subscriptions ✅
- [ ] Google OAuth ✅
- [ ] Push notifications ✅
- [ ] Report generation ✅
- [ ] Account deletion ✅
- [ ] Data export ✅

### 12.3 All Integrations Working
- [ ] Stripe payments ✅
- [ ] Google OAuth ✅
- [ ] Firebase FCM ✅
- [ ] OpenAI API ✅
- [ ] Email sending ✅

### 12.4 Security Verified
- [ ] HTTPS enabled ✅
- [ ] Security headers set ✅
- [ ] Rate limiting active ✅
- [ ] CORS configured correctly ✅
- [ ] No secrets in code/logs ✅

---

## 🚀 13. Go-Live Checklist

### 13.1 Pre-Launch (24 hours before)
- [ ] All tests passing
- [ ] All environment variables set
- [ ] Database backups configured
- [ ] Monitoring alerts configured
- [ ] Team notified of launch

### 13.2 Launch Day
- [ ] Final smoke test of all features
- [ ] Verify all services are healthy
- [ ] Monitor error logs closely
- [ ] Monitor performance metrics
- [ ] Be ready to rollback if needed

### 13.3 Post-Launch (First 24 hours)
- [ ] Monitor error rates
- [ ] Monitor performance metrics
- [ ] Check user registrations
- [ ] Verify payment processing
- [ ] Review security logs
- [ ] Gather user feedback

---

## 📞 Support & Escalation

### Emergency Contacts
- **Technical Lead**: ___________________
- **DevOps Engineer**: ___________________
- **Stripe Support**: https://support.stripe.com
- **Hosting Support**: [Your hosting provider support]

### Rollback Procedure
1. Identify issue
2. Check logs for errors
3. If critical, rollback to previous deployment
4. Document issue
5. Fix and redeploy

---

## 📊 Configuration Summary

### Environment Variables Count
- **Backend**: ~25 variables
- **Frontend**: ~10 variables

### External Services
- ✅ Stripe (Payments)
- ✅ Google OAuth (Authentication)
- ✅ Firebase FCM (Notifications)
- ✅ OpenAI (AI Chat)
- ✅ Email Service (SMTP/SendGrid)

### Estimated Configuration Time
- **Stripe Setup**: 1-2 hours
- **Google OAuth**: 1 hour
- **Firebase FCM**: 30 minutes
- **Database/Redis**: 30 minutes
- **Environment Variables**: 1 hour
- **Testing**: 2-3 hours
- **Total**: **6-8 hours** (1 day)

---

## ✅ Sign-Off

**Configuration Completed By**: ___________________  
**Date**: ___________________  
**All Items Checked**: [ ] Yes [ ] No  
**Ready for Production**: [ ] Yes [ ] No  

**Notes**:
_____________________________________________
_____________________________________________
_____________________________________________

---

**Status**: 🟢 **Ready for Production Configuration**  
**Last Updated**: December 2025  
**Next Step**: Begin Stripe account setup

