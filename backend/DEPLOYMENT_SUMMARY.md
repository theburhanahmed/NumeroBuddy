# Deployment Configuration Summary

This directory contains deployment configurations for Railway, Render, and Fly.io platforms.

## 📁 Configuration Files

### Railway
- ✅ `railway.json` - Railway platform configuration
- ✅ `Procfile` - Process definitions (web, worker, beat)
- 📖 `QUICKSTART_RAILWAY.md` - Step-by-step Railway deployment guide

### Render
- ✅ `../render.yaml` - Render Blueprint (infrastructure as code)
- 📖 `QUICKSTART_RENDER.md` - Step-by-step Render deployment guide

### Fly.io
- ✅ `fly.toml` - Fly.io application configuration
- ✅ `Dockerfile` - Container definition (already exists)
- 📖 `QUICKSTART_FLYIO.md` - Step-by-step Fly.io deployment guide

### Common
- 📖 `../DEPLOYMENT.md` - Comprehensive deployment guide for all platforms

## 🚀 Quick Start

Choose your platform and follow the quick start guide:

1. **Railway** (Easiest): See `QUICKSTART_RAILWAY.md`
2. **Render** (Free tier available): See `QUICKSTART_RENDER.md`
3. **Fly.io** (Global edge): See `QUICKSTART_FLYIO.md`

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Generated a new `SECRET_KEY` for production
- [ ] Set `DEBUG=False` in production
- [ ] Configured `ALLOWED_HOSTS` with your domains
- [ ] Set up PostgreSQL database
- [ ] Set up Redis instance
- [ ] Configured CORS settings for your frontend URL
- [ ] Set up email backend (if using email features)
- [ ] Configured API keys (OpenAI, Stripe, etc.)
- [ ] Set up monitoring (Sentry, etc.)

## 🔑 Environment Variables

All platforms require these key environment variables:

```bash
# Django Core
DJANGO_SETTINGS_MODULE=numerai.settings.production
SECRET_KEY=<generate-new-secret>
DEBUG=False
ALLOWED_HOSTS=your-domain.com

# Database (auto-configured by platforms)
DATABASE_URL=postgresql://...

# Redis (auto-configured by platforms, but need to set Celery URLs)
REDIS_URL=redis://...
CELERY_BROKER_URL=redis://.../1
CELERY_RESULT_BACKEND=redis://.../2

# CORS
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-frontend.vercel.app
```

See `DEPLOYMENT.md` for complete list.

## 🔄 Migration Commands

After deployment, run migrations:

- **Railway**: `railway run python manage.py migrate`
- **Render**: Use Render Shell or migrations run automatically in build.sh
- **Fly.io**: `fly ssh console -C "python manage.py migrate"`

## ✅ Health Check

All platforms use: `/api/v1/health/`

Test after deployment:
```bash
curl https://your-app-url.com/api/v1/health/
```

Expected response: `{"status":"healthy"}`

## 📊 Platform Comparison

| Platform | Best For | Free Tier | Ease |
|----------|----------|-----------|------|
| Railway | Quick setup, simplicity | Limited | ⭐⭐⭐⭐⭐ |
| Render | Free tier, blueprints | Yes (15min sleep) | ⭐⭐⭐⭐ |
| Fly.io | Global scale, Docker | Yes (3 VMs) | ⭐⭐⭐ |

## 🆘 Need Help?

1. Check platform-specific quick start guides
2. See `DEPLOYMENT.md` for detailed troubleshooting
3. Check platform documentation:
   - [Railway Docs](https://docs.railway.app)
   - [Render Docs](https://render.com/docs)
   - [Fly.io Docs](https://fly.io/docs)

## 📝 Notes

- All platforms support auto-deployment from Git
- Database migrations run automatically during Render builds
- Railway and Render provide managed PostgreSQL and Redis
- Fly.io requires separate PostgreSQL and Redis apps
- Celery workers are optional but recommended for background tasks
- Only run ONE Celery Beat instance to avoid duplicate scheduled tasks

---

**Ready to deploy?** Choose a platform and follow its quick start guide! 🚀
