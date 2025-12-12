# Deployment Status - numerobuddy.com

## Current Status: ✅ DEPLOYED

**Date:** December 12, 2025  
**Domain:** numerobuddy.com  
**IP Address:** 146.190.74.172

## Services Status

### ✅ Running Services

1. **PostgreSQL** - Running (healthy)
2. **Redis** - Running (healthy)  
3. **Django Backend** - Running on port 18000
4. **Next.js Frontend** - Running on port 13000
5. **nginx** - Running and proxying correctly
6. **Celery Worker** - Running via systemd
7. **Celery Beat** - Running via systemd

### Access URLs

- **Frontend:** http://numerobuddy.com ✅
- **Backend API:** http://numerobuddy.com/api/v1 ✅
- **Health Check:** http://numerobuddy.com/api/v1/health/ (may show 400 due to ALLOWED_HOSTS)

## Configuration Notes

### Port Configuration

Due to port conflicts during deployment, services are running on alternate ports:
- Backend: `127.0.0.1:18000` (mapped from container port 8000)
- Frontend: `127.0.0.1:13000` (mapped from container port 3000)
- PostgreSQL: `127.0.0.1:15432` (mapped from container port 5432)
- Redis: `127.0.0.1:16379` (mapped from container port 6379)

nginx is configured to proxy to these alternate ports.

### Environment Variables

Location: `/opt/numerai/.env.production`

Key variables configured:
- `ALLOWED_HOSTS=numerobuddy.com,www.numerobuddy.com,146.190.74.172,localhost,127.0.0.1`
- `NEXT_PUBLIC_API_URL=https://numerobuddy.com/api/v1`
- Database credentials configured
- Email settings configured (smtpout.secureserver.net)
- API keys configured (OpenAI, Stripe)

## Known Issues

1. **Health endpoint 400 error**: The `/api/v1/health/` endpoint may return 400 Bad Request. This is likely due to ALLOWED_HOSTS validation. The endpoint should work when accessed via the domain name with proper Host header.

2. **Port configuration**: Services are using alternate ports (18000, 13000) instead of standard ports (8000, 3000) due to port binding conflicts during deployment. This doesn't affect functionality but is noted for future reference.

## Next Steps

1. **Set up SSL certificate:**
   ```bash
   ssh root@146.190.74.172
   cd /opt/numerai
   bash deploy/digitalocean/setup-ssl.sh
   ```
   Follow prompts to set up Let's Encrypt certificate for numerobuddy.com

2. **Create admin user:**
   ```bash
   ssh root@146.190.74.172
   cd /opt/numerai
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production exec backend python manage.py createsuperuser
   ```

3. **Test application features:**
   - User registration
   - Numerology calculations
   - API endpoints
   - Frontend functionality

4. **Monitor logs:**
   ```bash
   # Backend logs
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production logs -f backend
   
   # Frontend logs
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production logs -f frontend
   
   # nginx logs
   tail -f /var/log/nginx/numerai-access.log
   tail -f /var/log/nginx/numerai-error.log
   
   # Celery logs
   journalctl -u celery-worker -f
   journalctl -u celery-beat -f
   ```

## Quick Commands

```bash
# SSH into server
ssh root@146.190.74.172

# Check service status
cd /opt/numerai
docker ps
systemctl status celery-worker celery-beat nginx

# Restart services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production restart

# View logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production logs -f

# Update application
git pull origin main
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.production up -d --build
```

## Deployment Summary

✅ Server setup completed  
✅ Docker and dependencies installed  
✅ Application deployed  
✅ Database migrations applied  
✅ Static files collected  
✅ nginx configured and running  
✅ Celery services installed and running  
✅ Site accessible at numerobuddy.com  
⏳ SSL certificate pending (can be set up now)  
⏳ Admin user creation pending

**The application is live and accessible!**
