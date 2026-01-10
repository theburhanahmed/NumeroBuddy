# Render Quick Start Guide

Deploy your NumerAI backend to Render using Blueprint (render.yaml).

## Prerequisites
- Render account at [render.com](https://render.com)
- GitHub/GitLab repository

## Step 1: One-Click Blueprint Deployment (Recommended)

1. **Push render.yaml to your repository root** (already done)

2. **In Render Dashboard**:
   - Click "New +" → "Blueprint"
   - Connect your GitHub/GitLab account
   - Select your repository
   - Render will detect `render.yaml` automatically

3. **Review services**:
   - ✅ Web service (Django)
   - ✅ PostgreSQL database
   - ✅ Redis cache
   - ✅ Celery worker (optional)
   - ✅ Celery beat (optional)

4. **Apply Blueprint**:
   - Click "Apply"
   - Render creates all services automatically

## Step 2: Configure Environment Variables

After Blueprint is applied, configure environment variables for each service:

### Web Service Environment Variables
```
SECRET_KEY=<generate-new-secret-key>
DEBUG=False
ALLOWED_HOSTS=your-app.onrender.com,your-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-frontend.vercel.app

# Add other required variables (see DEPLOYMENT.md)
```

Note: `DATABASE_URL` and `REDIS_URL` are automatically set by Render.

## Step 3: Manual Deployment (If Not Using Blueprint)

### Create Web Service
1. New → Web Service
2. Connect repository
3. Settings:
   - **Name**: `numerai-backend`
   - **Root Directory**: `backend`
   - **Region**: Choose closest to users
   - **Branch**: `main`
   - **Runtime**: Python 3
   - **Build Command**: `chmod +x build.sh && ./build.sh`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT --workers 2 --threads 2 --timeout 120 --access-logfile - --error-logfile - numerai.wsgi:application`
   - **Health Check Path**: `/api/v1/health/`

### Create PostgreSQL Database
1. New → PostgreSQL
2. Name: `numerai-db`
3. Plan: Start with Free, upgrade later
4. Link to web service (auto-sets `DATABASE_URL`)

### Create Redis
1. New → Redis
2. Name: `numerai-redis`
3. Plan: Start with Free
4. Link to web service (auto-sets `REDIS_URL`)
5. Manually set:
   - `CELERY_BROKER_URL` (same as REDIS_URL, database 1)
   - `CELERY_RESULT_BACKEND` (same as REDIS_URL, database 2)

### Create Celery Worker (Optional)
1. New → Background Worker
2. Name: `numerai-celery-worker`
3. Root Directory: `backend`
4. Build Command: `chmod +x build.sh && ./build.sh`
5. Start Command: `celery -A numerai worker --loglevel=info --concurrency=2`
6. Link to database and Redis

### Create Celery Beat (Optional)
1. New → Background Worker
2. Name: `numerai-celery-beat`
3. Root Directory: `backend`
4. Build Command: `chmod +x build.sh && ./build.sh`
5. Start Command: `celery -A numerai beat --loglevel=info`
6. Link to database and Redis

## Step 4: Run Migrations

Migrations run automatically during build (see `build.sh`), but you can run manually:

### Option A: Render Shell
1. In web service: Shell tab
2. Run: `python manage.py migrate`

### Option B: Local with Render CLI
```bash
render run python manage.py migrate
```

## Step 5: Verify Deployment

Check health endpoint:
```bash
curl https://your-app.onrender.com/api/v1/health/
```

Expected: `{"status":"healthy"}`

## Important Notes

### Free Tier Limitations
- ⚠️ Services **spin down after 15 minutes** of inactivity
- First request after spin-down takes ~30 seconds (cold start)
- ⚠️ Database backups: Daily (may lose up to 24 hours of data)
- ⚠️ Redis: Limited to 25MB

**For Production**: Upgrade to paid plan:
- Always-on services
- Better performance
- Automated backups
- Larger Redis

### Auto-Deploy
- Render auto-deploys on every push to `main` branch
- Disable in: Service → Settings → Auto-Deploy

### Custom Domain
1. Service → Settings → Custom Domains
2. Add your domain
3. Update `ALLOWED_HOSTS` environment variable
4. Add DNS records as shown

## Troubleshooting

- **Build timeout**: Increase build timeout in service settings
- **Memory errors**: Upgrade plan or optimize workers
- **Database connection errors**: Check `DATABASE_URL` is linked correctly
- **502 Bad Gateway**: Check logs, verify migrations ran
- **Static files 404**: Verify `collectstatic` ran during build

## View Logs

1. Service → Logs tab
2. Real-time log streaming
3. Download logs for analysis

## Next Steps

- Set up monitoring (integrate Sentry)
- Configure backups for database
- Set up staging environment
- See [DEPLOYMENT.md](../DEPLOYMENT.md) for advanced configuration
