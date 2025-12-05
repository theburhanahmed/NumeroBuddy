# 🚀 Deployment Instructions for Render.com

## Current Status
✅ All code is pushed to GitHub (`main` branch)  
✅ Latest commit: `fe1fdb7`  
✅ Configuration files ready (`render.yaml`, `build.sh`)  
✅ All fixes applied and pushed

---

## Deployment Options

### Option 1: Automatic Deployment (Already Triggered)
Render.com automatically deploys when code is pushed to the `main` branch. Since all code is already pushed, deployment should be in progress or completed.

**To Check:**
1. Go to https://dashboard.render.com
2. Check if services are building/deploying
3. Look for any errors in the logs

---

### Option 2: Manual Deployment via Render Dashboard

1. **Log into Render Dashboard**
   - Go to: https://dashboard.render.com
   - Sign in to your account

2. **Check Existing Services**
   - Look for services matching names in `render.yaml`:
     - `numerai-backend`
     - `numerai-frontend`
     - `numerai-celery-worker`
     - `numerai-celery-beat`
     - `numerai-redis`
     - `numerai-postgres`

3. **If Services Don't Exist: Deploy via Blueprint**
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository: `theburhanahmed/NumerAI`
   - Render will automatically detect `render.yaml`
   - Click "Apply" to create all services

4. **If Services Exist: Trigger Manual Deploy**
   - Go to each service
   - Click "Manual Deploy" → "Deploy latest commit"
   - Or: "Manual Deploy" → "Clear build cache & deploy"

---

### Option 3: Force New Deployment

To trigger a fresh deployment:

1. **Create an empty commit to trigger deployment:**
   ```bash
   git commit --allow-empty -m "Trigger deployment"
   git push origin main
   ```

2. **Or update a file and push:**
   ```bash
   # Touch a file to create a change
   touch .deploy-trigger
   git add .deploy-trigger
   git commit -m "Trigger deployment"
   git push origin main
   ```

---

## Services to Deploy

Based on `render.yaml`, the following services will be deployed:

### 1. Backend (Django)
- **Service:** `numerai-backend`
- **Build Time:** ~5-10 minutes
- **Health Check:** `/api/v1/health/`
- **URL:** https://numerai-backend.onrender.com

### 2. Frontend (Next.js)
- **Service:** `numerai-frontend`
- **Build Time:** ~5-8 minutes
- **URL:** https://numerai-frontend.onrender.com

### 3. Celery Worker
- **Service:** `numerai-celery-worker`
- **Start Time:** ~3-5 minutes

### 4. Celery Beat
- **Service:** `numerai-celery-beat`
- **Start Time:** ~3-5 minutes

### 5. Redis Cache
- **Service:** `numerai-redis`
- **Status:** Should be "Available"

### 6. PostgreSQL Database
- **Database:** `numerai-postgres`
- **Status:** Should be "Available"

---

## Monitoring Deployment

### Step 1: Check Service Status
1. Go to Render Dashboard
2. Look for each service
3. Check status indicators:
   - 🟡 **Building** - Deployment in progress
   - 🟢 **Live** - Successfully deployed
   - 🔴 **Failed** - Error occurred (check logs)

### Step 2: Monitor Build Logs
1. Click on each service
2. Go to "Logs" tab
3. Watch for:
   - ✅ Build completion messages
   - ❌ Error messages
   - ⚠️ Warning messages

### Step 3: Verify Services

#### Backend Health Check
```bash
curl https://numerai-backend.onrender.com/api/v1/health/
```

Expected response:
```json
{"status": "healthy"}
```

#### Frontend Check
Visit: https://numerai-frontend.onrender.com

Should load the landing page without errors.

---

## Common Deployment Issues

### Build Fails

**Backend Build Failures:**
- Check Python version (should be 3.11.0)
- Verify `requirements.txt` is complete
- Check migration errors in logs
- Ensure `build.sh` is executable

**Frontend Build Failures:**
- Check Node version (should be 18.17.0)
- Verify all dependencies in `package.json`
- Check for TypeScript errors
- Ensure build completes successfully

### Service Won't Start

**Backend Issues:**
- Check environment variables
- Verify DATABASE_URL is correct
- Check REDIS_URL connection
- Review service logs for errors

**Frontend Issues:**
- Verify NEXT_PUBLIC_API_URL is set
- Check CORS settings
- Review browser console errors

---

## Post-Deployment Verification

### ✅ Checklist

- [ ] All services show "Live" status
- [ ] Backend health check returns 200 OK
- [ ] Frontend loads successfully
- [ ] No errors in service logs
- [ ] Database migrations completed
- [ ] Celery workers running
- [ ] Redis connection successful

### Quick Test Commands

```bash
# Backend Health
curl https://numerai-backend.onrender.com/api/v1/health/

# API Documentation
open https://numerai-backend.onrender.com/api/schema/swagger-ui/

# Frontend
open https://numerai-frontend.onrender.com
```

---

## Next Steps After Deployment

1. **Test Authentication**
   - Register a new user
   - Verify OTP email
   - Complete login

2. **Test Core Features**
   - Generate birth chart
   - Calculate numerology
   - Generate daily reading

3. **Monitor Performance**
   - Check response times
   - Monitor error rates
   - Review metrics

---

## Support

If you encounter issues:
1. Check service logs in Render dashboard
2. Review `docs/DEPLOYMENT_STATUS.md`
3. Check `docs/TROUBLESHOOTING.md`
4. Verify all environment variables are set

---

**Ready to Deploy!** 🚀

All code is on GitHub and ready for Render.com to deploy automatically or manually.

