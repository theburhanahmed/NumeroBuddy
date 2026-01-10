# Deployment Guide: Railway, Render, and Fly.io

This guide covers deploying the NumerAI Django backend to Railway, Render, and Fly.io platforms.

## 📋 Prerequisites

- Git repository with your code
- PostgreSQL database (provided by platform or external)
- Redis instance (for caching and Celery)
- Environment variables configured
- Domain name (optional, for custom domains)

## 🔧 Common Environment Variables

All platforms require these environment variables:

```bash
# Django Settings
DJANGO_SETTINGS_MODULE=numerai.settings.production
SECRET_KEY=your-secret-key-here  # Generate with: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
DEBUG=False
ALLOWED_HOSTS=your-domain.com,your-app.up.railway.app,your-app.onrender.com

# Database (usually auto-configured by platform)
DATABASE_URL=postgresql://user:password@host:port/dbname

# Redis (for caching and Celery)
REDIS_URL=redis://host:port/0
CELERY_BROKER_URL=redis://host:port/1
CELERY_RESULT_BACKEND=redis://host:port/2

# CORS Settings (adjust to your frontend URL)
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-domain.com
CSRF_TRUSTED_ORIGINS=https://your-frontend.vercel.app,https://your-domain.com

# Email (configure based on your email service)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@your-domain.com

# OpenAI (if using AI features)
OPENAI_API_KEY=your-openai-api-key

# Stripe (if using payments)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google OAuth (if using social auth)
GOOGLE_OAUTH_CLIENT_ID=your-client-id
GOOGLE_OAUTH_CLIENT_SECRET=your-client-secret

# Apple OAuth (if using social auth)
APPLE_CLIENT_ID=your-client-id
APPLE_SECRET=your-secret

# Sentry (optional, for error tracking)
SENTRY_DSN=your-sentry-dsn
```

---

## 🚂 Railway Deployment

### Why Railway?
- **Easiest setup**: Auto-detects Django and PostgreSQL
- **Integrated services**: PostgreSQL and Redis available as add-ons
- **Simple pricing**: Pay-as-you-go
- **GitHub integration**: Auto-deploys on push

### Setup Steps

1. **Install Railway CLI** (optional, but recommended):
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Create a new project**:
   ```bash
   cd backend
   railway init
   ```

3. **Add PostgreSQL database**:
   - In Railway dashboard: New → Database → PostgreSQL
   - Railway automatically provides `DATABASE_URL` environment variable

4. **Add Redis**:
   - In Railway dashboard: New → Database → Redis
   - Railway automatically provides `REDIS_URL` environment variable
   - Set `CELERY_BROKER_URL` and `CELERY_RESULT_BACKEND` to the same Redis URL with different databases

5. **Configure environment variables**:
   - In Railway dashboard: Variables tab
   - Add all required environment variables from the list above

6. **Deploy**:
   ```bash
   railway up
   ```
   Or connect your GitHub repo in Railway dashboard for auto-deployments

7. **Add Celery Worker** (optional, for background tasks):
   - Create a new service in Railway
   - Use the same codebase
   - Set start command: `celery -A numerai worker --loglevel=info --concurrency=2`
   - Share environment variables with the web service

8. **Add Celery Beat** (optional, for scheduled tasks):
   - Create another service
   - Set start command: `celery -A numerai beat --loglevel=info`
   - Share environment variables

### Railway Configuration Files

- `backend/railway.json` - Railway-specific configuration
- `backend/Procfile` - Process definitions (Railway uses this)

### Railway Tips

- Railway auto-detects Python projects and uses Nixpacks builder
- The `railway.json` file provides custom build/start commands
- Use Railway's metrics dashboard to monitor performance
- Set up custom domain in the Settings tab

---

## 🎨 Render Deployment

### Why Render?
- **Free tier available**: Good for testing
- **Blueprints (render.yaml)**: Infrastructure as code
- **Integrated services**: PostgreSQL and Redis available
- **Automatic SSL**: Free SSL certificates

### Setup Steps

1. **Create Render account** at [render.com](https://render.com)

2. **One-click deployment with Blueprint**:
   - Push `render.yaml` to your repository root
   - In Render dashboard: New → Blueprint
   - Connect your GitHub/GitLab repository
   - Render will auto-detect `render.yaml` and create all services

3. **Manual deployment** (if not using Blueprint):
   - New → Web Service
   - Connect repository
   - Settings:
     - **Root Directory**: `backend`
     - **Build Command**: `chmod +x build.sh && ./build.sh`
     - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT --workers 2 --threads 2 --timeout 120 --access-logfile - --error-logfile - numerai.wsgi:application`
     - **Health Check Path**: `/api/v1/health/`

4. **Add PostgreSQL database**:
   - New → PostgreSQL
   - Render automatically provides `DATABASE_URL` to services linked to it

5. **Add Redis**:
   - New → Redis
   - Render automatically provides `REDIS_URL` to services linked to it

6. **Configure environment variables**:
   - In each service: Environment tab
   - Add all required variables (see list above)

7. **Add Celery Worker** (for background tasks):
   - New → Background Worker
   - Root Directory: `backend`
   - Build Command: `chmod +x build.sh && ./build.sh`
   - Start Command: `celery -A numerai worker --loglevel=info --concurrency=2`
   - Link to database and Redis

8. **Add Celery Beat** (for scheduled tasks):
   - New → Background Worker
   - Start Command: `celery -A numerai beat --loglevel=info`
   - Link to database and Redis

### Render Configuration Files

- `render.yaml` - Blueprint configuration (in repository root)
- All services defined in one file

### Render Tips

- Free tier has limits: Services spin down after 15 minutes of inactivity
- Upgrade to paid plan for always-on services
- Use `render.yaml` Blueprint for reproducible deployments
- Environment variables can be synced across services

---

## ✈️ Fly.io Deployment

### Why Fly.io?
- **Global edge deployment**: Deploy close to users
- **Docker-based**: Full control over container
- **Scaling**: Easy horizontal scaling
- **Multiple processes**: Run web, worker, and beat in same app

### Setup Steps

1. **Install Fly CLI**:
   ```bash
   curl -L https://fly.io/install.sh | sh
   # Or on macOS: brew install flyctl
   ```

2. **Login to Fly.io**:
   ```bash
   fly auth login
   ```

3. **Initialize Fly.io app** (from backend directory):
   ```bash
   cd backend
   fly launch
   ```
   - This will read `fly.toml` if it exists
   - Choose a region close to your users
   - Don't deploy yet (we'll configure first)

4. **Create PostgreSQL database**:
   ```bash
   fly postgres create --name numerai-db
   fly postgres attach --app numerai-backend numerai-db
   ```
   This automatically sets `DATABASE_URL`

5. **Create Redis instance**:
   ```bash
   fly redis create --name numerai-redis
   ```
   Note the connection URL and set it as:
   ```bash
   fly secrets set REDIS_URL="redis://..." \
     CELERY_BROKER_URL="redis://..." \
     CELERY_RESULT_BACKEND="redis://..."
   ```

6. **Set environment variables**:
   ```bash
   fly secrets set SECRET_KEY="your-secret-key" \
     DJANGO_SETTINGS_MODULE="numerai.settings.production" \
     DEBUG="False" \
     ALLOWED_HOSTS="your-app.fly.dev" \
     CORS_ALLOWED_ORIGINS="https://your-frontend.vercel.app"
   ```
   Set all other secrets as needed

7. **Deploy the web service**:
   ```bash
   fly deploy
   ```

8. **Scale Celery Worker** (optional):
   ```bash
   fly scale count worker=1 --process-group worker
   ```
   This uses the `worker` process defined in `fly.toml`

9. **Scale Celery Beat** (optional):
   ```bash
   fly scale count beat=1 --process-group beat
   ```
   Note: Only run ONE beat instance to avoid duplicate scheduled tasks

10. **Set up volumes** (if needed for media files):
    ```bash
    fly volumes create media_data --size 10 --region iad
    ```
    Then mount it in `fly.toml` under `[mounts]`

### Fly.io Configuration Files

- `backend/fly.toml` - Fly.io application configuration
- `backend/Dockerfile` - Container definition

### Fly.io Tips

- Use `fly status` to check app status
- Use `fly logs` to view application logs
- Use `fly ssh console` to access the container shell
- Fly.io supports multiple regions for global distribution
- Scale vertically: `fly scale vm shared-cpu-2x --memory 2048`
- Scale horizontally: `fly scale count app=3`

### Fly.io Process Groups

The `fly.toml` defines three processes:
- `app` - Main Django web server (auto-started)
- `worker` - Celery worker (scale manually: `fly scale count worker=1`)
- `beat` - Celery beat scheduler (scale manually: `fly scale count beat=1`)

---

## 🔄 Running Database Migrations

### Railway
```bash
railway run python manage.py migrate
```

### Render
Migrations run automatically during build (see `build.sh`), or:
- Use Render Shell: `render shell`
- Or use local CLI: `render run python manage.py migrate`

### Fly.io
```bash
fly ssh console -C "python manage.py migrate"
```

---

## 🧪 Health Checks

All platforms use the health check endpoint: `/api/v1/health/`

Test it manually:
```bash
curl https://your-app-url.com/api/v1/health/
```

Expected response:
```json
{"status": "healthy"}
```

---

## 📊 Monitoring and Logs

### Railway
- Dashboard: Real-time logs and metrics
- CLI: `railway logs`

### Render
- Dashboard: Logs and metrics
- Log streaming in dashboard

### Fly.io
- CLI: `fly logs`
- Dashboard: Metrics and logs
- Integrate with Datadog, Sentry, etc.

---

## 🔐 Security Best Practices

1. **Never commit secrets**: Use environment variables
2. **Use strong SECRET_KEY**: Generate a new one for production
3. **Enable HTTPS**: All platforms provide SSL automatically
4. **Set DEBUG=False**: Always in production
5. **Configure ALLOWED_HOSTS**: Restrict to your domains
6. **Use database connection pooling**: Already configured in settings
7. **Enable CORS properly**: Only allow your frontend domains
8. **Regular updates**: Keep dependencies updated

---

## 🚀 Performance Optimization

1. **Use CDN for static files**: 
   - Configure `STATIC_URL` to point to CDN
   - Or use WhiteNoise (already configured)

2. **Database connection pooling**:
   - Already configured with `conn_max_age=600`

3. **Caching**:
   - Redis caching is configured
   - Enable query caching in Django settings

4. **Worker processes**:
   - Adjust Gunicorn workers: `(2 x CPU cores) + 1`
   - Monitor memory usage

5. **Celery concurrency**:
   - Adjust based on task load: `--concurrency=2`

---

## 🐛 Troubleshooting

### Common Issues

**Migration errors**:
- Check migration history: `python manage.py showmigrations`
- Reset if needed (careful!): `python manage.py migrate --fake-initial`

**Static files not loading**:
- Run: `python manage.py collectstatic`
- Check `STATIC_ROOT` and `STATIC_URL` settings

**Database connection errors**:
- Verify `DATABASE_URL` format
- Check database is accessible from platform
- Verify network security groups

**Celery tasks not running**:
- Check Redis connection
- Verify worker is running
- Check logs for errors

**CORS errors**:
- Verify `CORS_ALLOWED_ORIGINS` includes frontend URL
- Check `CSRF_TRUSTED_ORIGINS` matches frontend
- Verify credentials are enabled if needed

---

## 📝 Platform Comparison

| Feature | Railway | Render | Fly.io |
|---------|---------|--------|--------|
| **Free Tier** | Limited | Yes (15min sleep) | Yes (3 VMs) |
| **Ease of Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **PostgreSQL** | ✅ Add-on | ✅ Add-on | ✅ Separate app |
| **Redis** | ✅ Add-on | ✅ Add-on | ✅ Separate app |
| **Auto-deploy** | ✅ | ✅ | ✅ |
| **Custom Domain** | ✅ | ✅ | ✅ |
| **Scaling** | ✅ | ✅ | ✅✅✅ |
| **Edge Locations** | Limited | Limited | ✅✅✅ Global |
| **Docker Support** | ✅ | ✅ | ✅✅✅ |
| **Process Groups** | Manual | Manual | ✅ Built-in |

---

## 🎯 Recommended Setup

- **Development/Testing**: Render (free tier)
- **Production (Simple)**: Railway (easiest)
- **Production (Scalable)**: Fly.io (best for global scale)
- **Hybrid**: Railway for web, Fly.io for workers

---

## 📚 Additional Resources

- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Fly.io Docs](https://fly.io/docs)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)

---

## 🔄 Updates and Maintenance

After deploying, remember to:

1. **Monitor logs** regularly
2. **Update dependencies**: `pip install -r requirements.txt --upgrade`
3. **Run migrations** when updating code
4. **Backup database** regularly (most platforms auto-backup)
5. **Review security** settings periodically
6. **Scale resources** based on traffic

---

**Need help?** Check platform-specific support or create an issue in the repository.
