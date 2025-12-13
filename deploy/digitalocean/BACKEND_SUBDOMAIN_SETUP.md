# Backend Subdomain Setup Guide

This guide explains how to set up `backend.numerobuddy.com` as a direct API endpoint.

## What Has Been Configured

### 1. Nginx Configuration
- Added HTTP server block for `backend.numerobuddy.com` (lines 22-65)
- Added HTTPS server block for `backend.numerobuddy.com` (lines 200-264)
- Both blocks proxy all requests directly to the Django backend
- Server blocks are placed FIRST to ensure proper matching

### 2. Django ALLOWED_HOSTS
- Automatically adds `backend.numerobuddy.com` when `numerobuddy.com` is in ALLOWED_HOSTS
- Strips invalid characters (backslashes, forward slashes)
- Includes `backend`, `localhost`, and `127.0.0.1` for internal Docker networking

### 3. Scripts Created
- `setup-backend-subdomain.sh` - Complete automated setup
- `verify-backend-subdomain.sh` - Verification and testing

## Setup Instructions

### On Your Production Server

1. **Pull the latest code:**
   ```bash
   cd /opt/numerai
   git pull origin main  # or master
   ```

2. **Run the setup script:**
   ```bash
   cd /opt/numerai/deploy/digitalocean
   chmod +x setup-backend-subdomain.sh
   sudo ./setup-backend-subdomain.sh
   ```

   This script will:
   - Backup your current nginx config
   - Copy the updated config
   - Clean ALLOWED_HOSTS in .env.production
   - Test nginx configuration
   - Reload nginx
   - Restart backend

3. **Verify the setup:**
   ```bash
   chmod +x verify-backend-subdomain.sh
   ./verify-backend-subdomain.sh
   ```

4. **Test locally (before DNS):**
   ```bash
   # Add to /etc/hosts for local testing
   echo "127.0.0.1 backend.numerobuddy.com" | sudo tee -a /etc/hosts
   
   # Test the endpoint
   curl http://backend.numerobuddy.com/api/v1/health/
   ```

5. **Configure DNS:**
   Add an A record in your DNS provider:
   - Name: `backend`
   - Type: `A`
   - Value: Your server IP address
   - TTL: 300 (or default)

6. **Update SSL Certificate (after DNS):**
   ```bash
   sudo certbot --nginx -d numerobuddy.com -d www.numerobuddy.com -d backend.numerobuddy.com
   ```

7. **Test from outside:**
   ```bash
   curl http://backend.numerobuddy.com/api/v1/health/
   curl https://backend.numerobuddy.com/api/v1/health/
   ```

## Configuration Details

### Nginx Server Blocks

**HTTP (Port 80):**
```
server {
    listen 80;
    listen [::]:80;
    server_name backend.numerobuddy.com;
    # Proxies all requests to http://backend (Django)
}
```

**HTTPS (Port 443):**
```
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name backend.numerobuddy.com;
    # SSL configuration + proxies to Django
}
```

### Django ALLOWED_HOSTS

The production settings automatically:
1. Read ALLOWED_HOSTS from environment variable
2. Clean invalid characters (backslashes, forward slashes)
3. Add `backend.numerobuddy.com` if `numerobuddy.com` is present
4. Include `backend`, `localhost`, `127.0.0.1` for internal networking

Example: If `.env.production` has:
```
ALLOWED_HOSTS=numerobuddy.com,www.numerobuddy.com
```

Django will automatically allow:
- `numerobuddy.com`
- `www.numerobuddy.com`
- `backend.numerobuddy.com` (auto-added)
- `backend` (internal Docker)
- `localhost` (internal)
- `127.0.0.1` (internal)

## Troubleshooting

### 404 Not Found
- Ensure the updated nginx config is on the server
- Check nginx config syntax: `sudo nginx -t`
- Reload nginx: `sudo systemctl reload nginx`
- Check server block order (backend subdomain should come first)

### 400 Bad Request / DisallowedHost
- Check ALLOWED_HOSTS in `.env.production` (no backslashes)
- Restart backend: `docker-compose restart backend`
- Verify backend.numerobuddy.com is in ALLOWED_HOSTS (check logs)

### 502 Bad Gateway
- Check if backend container is running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Verify upstream `backend` is accessible on port 8000

### DNS Issues
- Verify DNS record exists: `dig backend.numerobuddy.com`
- Wait for DNS propagation (can take up to 48 hours, usually 5-15 minutes)
- Test locally with /etc/hosts first

## Usage

Once set up, you can use `backend.numerobuddy.com` as your API base URL:

```
https://backend.numerobuddy.com/api/v1/health/
https://backend.numerobuddy.com/api/v1/auth/login/
https://backend.numerobuddy.com/api/v1/users/profile/
```

This is useful for:
- Direct API access
- Mobile app backends
- Third-party integrations
- Separate API documentation

