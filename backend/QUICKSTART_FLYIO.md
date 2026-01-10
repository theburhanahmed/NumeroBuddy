# Fly.io Quick Start Guide

Deploy your NumerAI backend to Fly.io for global edge deployment.

## Prerequisites
- Fly.io account at [fly.io](https://fly.io)
- Fly CLI installed: `curl -L https://fly.io/install.sh | sh`
  - Or macOS: `brew install flyctl`

## Step 1: Login
```bash
fly auth login
```

## Step 2: Initialize App

```bash
cd backend
fly launch
```

When prompted:
- **App name**: `numerai-backend` (or choose your own)
- **Region**: Choose closest to your users (e.g., `iad` for US East)
- **PostgreSQL**: Yes (creates database)
- **Redis**: No (we'll create separately)
- **Deploy now**: No (we'll configure first)

## Step 3: Create PostgreSQL Database

```bash
fly postgres create --name numerai-db --region iad --vm-size shared-cpu-1x --volume-size 10
```

Attach to your app:
```bash
fly postgres attach --app numerai-backend numerai-db
```

This automatically sets `DATABASE_URL` secret.

## Step 4: Create Redis

```bash
fly redis create --name numerai-redis --region iad --plan development
```

Note the connection URL from output, then set secrets:
```bash
fly secrets set \
  REDIS_URL="redis://default:<password>@<host>:<port>" \
  CELERY_BROKER_URL="redis://default:<password>@<host>:<port>/1" \
  CELERY_RESULT_BACKEND="redis://default:<password>@<host>:<port>/2"
```

## Step 5: Set Environment Variables

Set required secrets:
```bash
fly secrets set \
  SECRET_KEY="<generate-with: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'>" \
  DJANGO_SETTINGS_MODULE="numerai.settings.production" \
  DEBUG="False" \
  ALLOWED_HOSTS="numerai-backend.fly.dev,your-domain.com" \
  CORS_ALLOWED_ORIGINS="https://your-frontend.vercel.app" \
  CSRF_TRUSTED_ORIGINS="https://your-frontend.vercel.app"

# Add other secrets as needed (see DEPLOYMENT.md)
```

View all secrets:
```bash
fly secrets list
```

## Step 6: Deploy

```bash
fly deploy
```

This builds and deploys your app using the `Dockerfile`.

## Step 7: Run Migrations

```bash
fly ssh console -C "python manage.py migrate"
```

Or use:
```bash
fly ssh console
# Then inside container:
python manage.py migrate
python manage.py collectstatic --noinput
```

## Step 8: Scale Celery Workers (Optional)

### Start Worker Process
```bash
fly scale count worker=1 --process-group worker
```

### Start Beat Process (Only ONE instance!)
```bash
fly scale count beat=1 --process-group beat
```

⚠️ **Important**: Only run ONE beat instance to avoid duplicate scheduled tasks.

## Step 9: Verify Deployment

Check app status:
```bash
fly status
```

Check health endpoint:
```bash
curl https://numerai-backend.fly.dev/api/v1/health/
```

Expected: `{"status":"healthy"}`

## Step 10: Set Custom Domain (Optional)

```bash
fly certs add your-domain.com
```

Follow DNS instructions, then update:
```bash
fly secrets set ALLOWED_HOSTS="your-domain.com,numerai-backend.fly.dev"
```

## Useful Commands

### View Logs
```bash
fly logs
# Or specific process:
fly logs --process app
fly logs --process worker
fly logs --process beat
```

### SSH into Container
```bash
fly ssh console
```

### Scale Vertically (More Resources)
```bash
fly scale vm shared-cpu-2x --memory 2048
```

### Scale Horizontally (More Instances)
```bash
fly scale count app=3  # 3 web instances
fly scale count worker=2  # 2 worker instances
```

### View Metrics
```bash
fly dashboard
# Opens browser with metrics
```

### Check App Info
```bash
fly info
fly status
```

### Restart App
```bash
fly apps restart numerai-backend
```

### Open App in Browser
```bash
fly open
```

## Process Groups

Your `fly.toml` defines three process groups:

1. **app** - Django web server (auto-started)
2. **worker** - Celery worker (scale manually)
3. **beat** - Celery beat scheduler (scale manually)

View running processes:
```bash
fly status
```

Scale processes:
```bash
fly scale count worker=2 --process-group worker
fly scale count beat=1 --process-group beat
```

## Free Tier Limits

- 3 shared-cpu-1x VMs with 256MB RAM
- 3GB outbound data transfer
- PostgreSQL: 256MB storage
- Good for testing, upgrade for production

## Troubleshooting

### Build Fails
```bash
fly logs
# Check Dockerfile build errors
```

### App Won't Start
```bash
fly logs --process app
# Check for missing environment variables
```

### Database Connection Errors
```bash
fly secrets list
# Verify DATABASE_URL is set
fly postgres connect -a numerai-db
# Test database connection
```

### Static Files 404
SSH into container and run:
```bash
fly ssh console -C "python manage.py collectstatic --noinput"
```

### Health Check Failing
```bash
fly logs --process app | grep health
# Check health endpoint logs
```

## Monitoring

### Integrate Sentry
```bash
fly secrets set SENTRY_DSN="your-sentry-dsn"
```

### View Metrics
```bash
fly dashboard
# Or use fly.io metrics API
```

## Multi-Region Deployment

Deploy to multiple regions for global distribution:
```bash
fly regions add hkg  # Hong Kong
fly regions add fra  # Frankfurt
fly deploy
```

Fly.io automatically routes users to the closest region.

## Backup Database

```bash
# Create backup
fly postgres backup create -a numerai-db

# List backups
fly postgres backup list -a numerai-db

# Restore from backup
fly postgres backup restore <backup-id> -a numerai-db
```

## Next Steps

- Set up monitoring and alerting
- Configure backups
- Scale based on traffic
- Deploy to multiple regions
- See [DEPLOYMENT.md](../DEPLOYMENT.md) for advanced configuration
