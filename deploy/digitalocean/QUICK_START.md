# Quick Start: Automated DigitalOcean Deployment

This guide will help you deploy NumerAI to DigitalOcean in under 30 minutes.

## Prerequisites

1. **DigitalOcean Account** - Sign up at https://www.digitalocean.com
2. **Domain Name** - A domain you own (or use the droplet IP temporarily)
3. **API Keys Ready** - OpenAI, Stripe (optional), Firebase (optional)

## Step 1: Get DigitalOcean API Token

1. Go to https://cloud.digitalocean.com/account/api/tokens
2. Click "Generate New Token"
3. Give it a name: "NumerAI Deployment"
4. Copy the token (you'll only see it once!)

## Step 2: Install DigitalOcean CLI

**On macOS:**
```bash
brew install doctl
```

**On Linux:**
```bash
cd /Users/burhanahmed/Desktop/NumerAI
bash deploy/digitalocean/install-doctl.sh
```

**On Windows (WSL):**
```bash
# Use Linux instructions above
```

## Step 3: Configure Deployment

1. Navigate to the deployment directory:
```bash
cd /Users/burhanahmed/Desktop/NumerAI/deploy/digitalocean
```

2. The script will create a config file automatically on first run, or create it manually:
```bash
cat > deploy-config.env << 'EOF'
# DigitalOcean API Token
DO_API_TOKEN=your_token_here

# Droplet Configuration
DROPLET_NAME=numerai-production
DROPLET_SIZE=s-2vcpu-4gb
DROPLET_REGION=nyc1
DROPLET_IMAGE=ubuntu-22-04-x64

# Domain Configuration
DOMAIN_NAME=yourdomain.com
DOMAIN_EMAIL=your-email@example.com

# Repository
GIT_REPO=https://github.com/theburhanahmed/NumerAI.git
GIT_BRANCH=main

# Optional: Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Optional: API Keys
OPENAI_API_KEY=sk-your-key
STRIPE_PUBLIC_KEY=pk_live_your-key
STRIPE_SECRET_KEY=sk_live_your-key
EOF
```

3. Edit the file and fill in your values:
```bash
nano deploy-config.env
```

**Required:**
- `DO_API_TOKEN` - Your DigitalOcean API token
- `DOMAIN_NAME` - Your domain (or use droplet IP)
- `DOMAIN_EMAIL` - Email for SSL certificates

**Optional (can be set later):**
- Email credentials
- API keys (OpenAI, Stripe, etc.)

## Step 4: Run Automated Deployment

```bash
chmod +x auto-deploy.sh
./auto-deploy.sh
```

The script will:
1. ✅ Create a DigitalOcean droplet
2. ✅ Set up SSH keys
3. ✅ Install Docker, nginx, and all dependencies
4. ✅ Clone your repository
5. ✅ Configure environment variables
6. ✅ Deploy the application
7. ✅ Set up SSL certificates (if DNS is configured)

**Time:** Approximately 20-30 minutes

## Step 5: Configure DNS (if using domain)

After deployment, point your domain to the droplet:

1. Get your droplet IP from the deployment output
2. Go to your domain registrar
3. Add/update A record:
   - **Type:** A
   - **Name:** @ (or blank)
   - **Value:** `<your-droplet-ip>`
   - **TTL:** 3600

4. Wait 5-10 minutes for DNS propagation
5. Set up SSL:
```bash
ssh root@<droplet-ip> 'cd /opt/numerai && bash deploy/digitalocean/setup-ssl.sh'
```

## Step 6: Create Admin User

```bash
ssh numerai@<droplet-ip>
cd /opt/numerai
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

## What You Get

After deployment, your application will be available at:

- **Frontend:** `https://yourdomain.com` (or `http://<droplet-ip>`)
- **Backend API:** `https://yourdomain.com/api/v1`
- **Health Check:** `https://yourdomain.com/api/v1/health/`
- **API Docs:** `https://yourdomain.com/api/schema/swagger-ui/`

## Troubleshooting

### Deployment Fails

1. Check your API token is valid:
```bash
doctl auth init -t YOUR_TOKEN
doctl account get
```

2. Check droplet status:
```bash
doctl compute droplet list
```

3. SSH into droplet and check logs:
```bash
ssh root@<droplet-ip>
docker-compose -f /opt/numerai/docker-compose.yml -f /opt/numerai/docker-compose.prod.yml logs
```

### Services Not Starting

1. Check environment variables:
```bash
ssh numerai@<droplet-ip> 'cat /opt/numerai/.env.production'
```

2. Check Docker containers:
```bash
ssh root@<droplet-ip> 'docker ps -a'
```

3. Restart services:
```bash
ssh numerai@<droplet-ip> 'cd /opt/numerai && docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart'
```

### SSL Certificate Issues

1. Verify DNS is pointing correctly:
```bash
dig yourdomain.com
```

2. Check nginx configuration:
```bash
ssh root@<droplet-ip> 'nginx -t'
```

3. Manually run SSL setup:
```bash
ssh root@<droplet-ip> 'cd /opt/numerai && bash deploy/digitalocean/setup-ssl.sh'
```

## Next Steps

1. **Set up monitoring** - Configure health checks and alerts
2. **Configure backups** - Set up automated database backups
3. **Scale if needed** - Upgrade droplet size or add more droplets
4. **Set up CDN** - Use DigitalOcean Spaces or Cloudflare for static assets

## Cost Estimate

- **Droplet (4GB RAM):** ~$24/month
- **Domain:** ~$10-15/year
- **Total:** ~$25-30/month

## Support

For detailed documentation, see:
- [Full Deployment Guide](../../docs/DIGITALOCEAN_DEPLOYMENT.md)
- [Troubleshooting Guide](../../docs/DIGITALOCEAN_DEPLOYMENT.md#troubleshooting)

