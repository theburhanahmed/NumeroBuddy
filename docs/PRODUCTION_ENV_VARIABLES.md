# NumerAI - Production Environment Variables Reference

**Quick Reference Guide**  
**Date:** December 2025

---

## 🔐 Backend Environment Variables

### Core Django Settings
```bash
# Django Core
SECRET_KEY=your-super-secret-key-min-50-chars
DEBUG=False
ALLOWED_HOSTS=your-backend-domain.com,www.your-backend-domain.com
DJANGO_SETTINGS_MODULE=numerai.settings.production
```

### Database Configuration
```bash
# Option 1: Connection String
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Option 2: Individual Variables
DB_NAME=numerai_production
DB_USER=numerai_user
DB_PASSWORD=your-secure-password
DB_HOST=your-db-host.com
DB_PORT=5432
```

### Redis Configuration
```bash
REDIS_URL=redis://:password@host:6379/0
CELERY_BROKER_URL=redis://:password@host:6379/0
CELERY_RESULT_BACKEND=redis://:password@host:6379/0
```

### Stripe Payment Integration
```bash
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
STRIPE_PRICE_ID_BASIC=price_xxxxxxxxxxxxx
STRIPE_PRICE_ID_PREMIUM=price_xxxxxxxxxxxxx
STRIPE_PRICE_ID_ELITE=price_xxxxxxxxxxxxx
```

### Google OAuth
```bash
GOOGLE_OAUTH_CLIENT_ID=xxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
```

### Firebase Cloud Messaging
```bash
FIREBASE_SERVER_KEY=AAAAxxxxxxxxxxxxx
FIREBASE_PROJECT_ID=numerai
```

### OpenAI API
```bash
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
```

### Email Configuration (SMTP)
```bash
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@your-domain.com
SERVER_EMAIL=server@your-domain.com
```

### Email Configuration (SendGrid)
```bash
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=SG.xxxxxxxxxxxxx
DEFAULT_FROM_EMAIL=noreply@your-domain.com
```

### CORS & Security
```bash
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### Optional: Error Tracking (Sentry)
```bash
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

---

## 🎨 Frontend Environment Variables

### API Configuration
```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api/v1
```

### Stripe Payment Integration
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxx
```

### Google OAuth
```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxxxxxxxxxx.apps.googleusercontent.com
```

### Firebase Cloud Messaging
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=numerai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=numerai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=numerai.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_VAPID_KEY=xxxxxxxxxxxxx
```

### Environment
```bash
NODE_ENV=production
```

### Optional: Analytics
```bash
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

## 📋 Environment Variables Checklist

### Backend (25 variables)
- [ ] `SECRET_KEY`
- [ ] `DEBUG`
- [ ] `ALLOWED_HOSTS`
- [ ] `DJANGO_SETTINGS_MODULE`
- [ ] `DATABASE_URL` (or `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`)
- [ ] `REDIS_URL`
- [ ] `CELERY_BROKER_URL`
- [ ] `CELERY_RESULT_BACKEND`
- [ ] `STRIPE_SECRET_KEY`
- [ ] `STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET`
- [ ] `STRIPE_PRICE_ID_BASIC`
- [ ] `STRIPE_PRICE_ID_PREMIUM`
- [ ] `STRIPE_PRICE_ID_ELITE`
- [ ] `GOOGLE_OAUTH_CLIENT_ID`
- [ ] `GOOGLE_OAUTH_CLIENT_SECRET`
- [ ] `FIREBASE_SERVER_KEY`
- [ ] `FIREBASE_PROJECT_ID`
- [ ] `OPENAI_API_KEY`
- [ ] `EMAIL_BACKEND`
- [ ] `EMAIL_HOST`
- [ ] `EMAIL_PORT`
- [ ] `EMAIL_USE_TLS`
- [ ] `EMAIL_HOST_USER`
- [ ] `EMAIL_HOST_PASSWORD`
- [ ] `DEFAULT_FROM_EMAIL`
- [ ] `CORS_ALLOWED_ORIGINS`
- [ ] `SECURE_SSL_REDIRECT`
- [ ] `SESSION_COOKIE_SECURE`
- [ ] `CSRF_COOKIE_SECURE`

### Frontend (10 variables)
- [ ] `NEXT_PUBLIC_API_URL`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_VAPID_KEY`
- [ ] `NODE_ENV`

---

## 🔑 How to Generate SECRET_KEY

```bash
# Using Python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Using Django shell
python manage.py shell
>>> from django.core.management.utils import get_random_secret_key
>>> get_random_secret_key()
```

---

## 📝 Notes

1. **Never commit** `.env` files to version control
2. **Use strong passwords** for all services
3. **Store secrets securely** (password manager, secret management service)
4. **Rotate keys regularly** (every 90 days recommended)
5. **Use different keys** for development, staging, and production
6. **Test all integrations** after setting environment variables

---

## 🔄 Environment-Specific Values

### Development
- `DEBUG=True`
- `ALLOWED_HOSTS=localhost,127.0.0.1`
- Use test API keys (Stripe test mode, etc.)

### Staging
- `DEBUG=False`
- `ALLOWED_HOSTS=staging.your-domain.com`
- Use test API keys

### Production
- `DEBUG=False`
- `ALLOWED_HOSTS=your-domain.com,www.your-domain.com`
- Use live API keys
- Enable all security settings

---

**Last Updated**: December 2025

