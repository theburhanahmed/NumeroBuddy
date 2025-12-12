#!/bin/bash
# Automated DigitalOcean Deployment Script
# This script automates the entire deployment process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo -e "${BLUE}=========================================="
echo "NumerAI Automated DigitalOcean Deployment"
echo "==========================================${NC}"
echo ""

# Check for required tools
command -v doctl >/dev/null 2>&1 || {
    echo -e "${YELLOW}doctl (DigitalOcean CLI) not found. Installing...${NC}"
    cd /tmp
    wget https://github.com/digitalocean/doctl/releases/download/v1.104.0/doctl-1.104.0-linux-amd64.tar.gz
    tar xf doctl-1.104.0-linux-amd64.tar.gz
    sudo mv doctl /usr/local/bin
    echo -e "${GREEN}doctl installed${NC}"
}

# Load configuration
CONFIG_FILE="${SCRIPT_DIR}/deploy-config.env"
if [ ! -f "${CONFIG_FILE}" ]; then
    echo -e "${YELLOW}Configuration file not found. Creating template...${NC}"
    cat > "${CONFIG_FILE}" << 'EOF'
# DigitalOcean Deployment Configuration
# Fill in all values before running auto-deploy.sh

# DigitalOcean API Token (get from https://cloud.digitalocean.com/account/api/tokens)
DO_API_TOKEN=your_do_api_token_here

# Droplet Configuration
DROPLET_NAME=numerai-production
DROPLET_SIZE=s-2vcpu-4gb
DROPLET_REGION=nyc1
DROPLET_IMAGE=ubuntu-22-04-x64

# Domain Configuration
DOMAIN_NAME=yourdomain.com
DOMAIN_EMAIL=your-email@example.com

# SSH Key (optional - will use existing or create new)
SSH_KEY_NAME=numerai-deploy-key

# Repository
GIT_REPO=https://github.com/theburhanahmed/NumerAI.git
GIT_BRANCH=main

# Application Configuration
APP_USER=numerai
APP_DIR=/opt/numerai

# Environment Variables (will be prompted if not set)
# SECRET_KEY=generate-if-empty
# DB_PASSWORD=generate-if-empty
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASSWORD=your-app-password
# OPENAI_API_KEY=your-openai-key
# STRIPE_PUBLIC_KEY=your-stripe-public-key
# STRIPE_SECRET_KEY=your-stripe-secret-key
EOF
    echo -e "${GREEN}Created ${CONFIG_FILE}${NC}"
    echo -e "${YELLOW}Please edit ${CONFIG_FILE} and fill in all required values${NC}"
    echo "Then run this script again."
    exit 1
fi

# Load configuration
source "${CONFIG_FILE}"

# Validate required variables
if [ "$DO_API_TOKEN" == "your_do_api_token_here" ] || [ -z "$DO_API_TOKEN" ]; then
    echo -e "${RED}Error: DO_API_TOKEN not set in ${CONFIG_FILE}${NC}"
    exit 1
fi

if [ "$DOMAIN_NAME" == "yourdomain.com" ] || [ -z "$DOMAIN_NAME" ]; then
    echo -e "${RED}Error: DOMAIN_NAME not set in ${CONFIG_FILE}${NC}"
    exit 1
fi

# Authenticate with DigitalOcean
echo -e "${GREEN}[1/10] Authenticating with DigitalOcean...${NC}"
doctl auth init -t "$DO_API_TOKEN" 2>/dev/null || {
    echo -e "${RED}Failed to authenticate with DigitalOcean. Check your API token.${NC}"
    exit 1
}

# Check for existing droplet
echo -e "${GREEN}[2/10] Checking for existing droplet...${NC}"
EXISTING_DROPLET=$(doctl compute droplet list --format ID,Name --no-header | grep "$DROPLET_NAME" | awk '{print $1}' | head -n 1)

if [ ! -z "$EXISTING_DROPLET" ]; then
    echo -e "${YELLOW}Found existing droplet: ${EXISTING_DROPLET}${NC}"
    # Auto-use existing droplet (set RECREATE_DROPLET=true in config to force recreation)
    if [ "${RECREATE_DROPLET:-false}" == "true" ]; then
        echo "Deleting existing droplet (RECREATE_DROPLET=true)..."
        doctl compute droplet delete -f "$EXISTING_DROPLET"
        sleep 5
        EXISTING_DROPLET=""
    else
        DROPLET_ID="$EXISTING_DROPLET"
        echo -e "${GREEN}Using existing droplet: ${DROPLET_ID}${NC}"
    fi
fi

# Get or create SSH key
echo -e "${GREEN}[3/10] Setting up SSH key...${NC}"
SSH_KEY_ID=$(doctl compute ssh-key list --format ID,Name --no-header | grep "$SSH_KEY_NAME" | awk '{print $1}' | head -n 1)

if [ -z "$SSH_KEY_ID" ]; then
    echo "Creating new SSH key..."
    if [ ! -f ~/.ssh/id_rsa.pub ]; then
        ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N "" -C "numerai-deploy"
    fi
    SSH_PUBLIC_KEY=$(cat ~/.ssh/id_rsa.pub)
    SSH_KEY_ID=$(doctl compute ssh-key create "$SSH_KEY_NAME" --public-key "$SSH_PUBLIC_KEY" --format ID --no-header)
    echo -e "${GREEN}Created SSH key: ${SSH_KEY_ID}${NC}"
else
    echo -e "${GREEN}Using existing SSH key: ${SSH_KEY_ID}${NC}"
fi

# Create droplet if needed
if [ -z "$DROPLET_ID" ]; then
    echo -e "${GREEN}[4/10] Creating DigitalOcean droplet...${NC}"
    doctl compute droplet create "$DROPLET_NAME" \
        --size "$DROPLET_SIZE" \
        --image "$DROPLET_IMAGE" \
        --region "$DROPLET_REGION" \
        --ssh-keys "$SSH_KEY_ID" \
        --wait
    
    # Get droplet info
    DROPLET_ID=$(doctl compute droplet list --format ID,Name --no-header | grep "$DROPLET_NAME" | awk '{print $1}' | head -n 1)
    DROPLET_IP=$(doctl compute droplet get "$DROPLET_ID" --format PublicIPv4 --no-header)
    
    if [ -z "$DROPLET_IP" ]; then
        echo -e "${RED}Failed to get droplet IP address${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}Droplet created: ${DROPLET_ID}${NC}"
    echo -e "${GREEN}IP Address: ${DROPLET_IP}${NC}"
else
    echo -e "${GREEN}[4/10] Getting droplet IP address...${NC}"
    DROPLET_IP=$(doctl compute droplet get "$DROPLET_ID" --format PublicIPv4 --no-header)
    echo -e "${GREEN}IP Address: ${DROPLET_IP}${NC}"
fi

# Wait for SSH to be ready
echo -e "${GREEN}[5/10] Waiting for SSH to be ready...${NC}"
MAX_ATTEMPTS=30
ATTEMPT=0
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 root@"$DROPLET_IP" "echo 'SSH ready'" 2>/dev/null; then
        echo -e "${GREEN}SSH is ready!${NC}"
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    echo "Waiting for SSH... ($ATTEMPT/$MAX_ATTEMPTS)"
    sleep 5
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo -e "${RED}SSH connection failed after ${MAX_ATTEMPTS} attempts${NC}"
    exit 1
fi

# Accept SSH host key
ssh-keyscan -H "$DROPLET_IP" >> ~/.ssh/known_hosts 2>/dev/null || true

# Copy deployment files to server
echo -e "${GREEN}[6/10] Copying deployment files to server...${NC}"
ssh root@"$DROPLET_IP" "mkdir -p /tmp/numerai-deploy"
scp -r "${PROJECT_ROOT}/deploy" root@"$DROPLET_IP":/tmp/numerai-deploy/
scp -r "${PROJECT_ROOT}/docker-compose.yml" root@"$DROPLET_IP":/tmp/numerai-deploy/
scp -r "${PROJECT_ROOT}/docker-compose.prod.yml" root@"$DROPLET_IP":/tmp/numerai-deploy/ 2>/dev/null || true

# Run server setup
echo -e "${GREEN}[7/10] Running server setup...${NC}"
ssh root@"$DROPLET_IP" "cd /tmp/numerai-deploy && chmod +x deploy/digitalocean/*.sh && bash deploy/digitalocean/setup-server.sh"

# Clone repository and move to production directory
echo -e "${GREEN}[8/10] Cloning repository...${NC}"
ssh root@"$DROPLET_IP" "rm -rf ${APP_DIR} && git clone -b ${GIT_BRANCH} ${GIT_REPO} ${APP_DIR} && chown -R ${APP_USER}:${APP_USER} ${APP_DIR}"

# Generate secrets if not provided
if [ -z "$SECRET_KEY" ] || [ "$SECRET_KEY" == "generate-if-empty" ]; then
    SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())" 2>/dev/null || openssl rand -hex 32)
fi

if [ -z "$DB_PASSWORD" ] || [ "$DB_PASSWORD" == "generate-if-empty" ]; then
    DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
fi

# Create environment file
echo -e "${GREEN}[9/10] Configuring environment variables...${NC}"
ssh root@"$DROPLET_IP" "cat > ${APP_DIR}/.env.production << EOF
DEBUG=False
SECRET_KEY=${SECRET_KEY}
ALLOWED_HOSTS=${DOMAIN_NAME},www.${DOMAIN_NAME}
DJANGO_SETTINGS_MODULE=numerai.settings.production

DB_NAME=numerai
DB_USER=numerai
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=postgres
DB_PORT=5432

REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=redis://redis:6379/1
CELERY_RESULT_BACKEND=redis://redis:6379/2

CORS_ALLOWED_ORIGINS=https://${DOMAIN_NAME},https://www.${DOMAIN_NAME}
CSRF_TRUSTED_ORIGINS=https://${DOMAIN_NAME},https://www.${DOMAIN_NAME}

NEXT_PUBLIC_API_URL=https://${DOMAIN_NAME}/api/v1

EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=${EMAIL_HOST:-smtp.gmail.com}
EMAIL_PORT=${EMAIL_PORT:-587}
EMAIL_USE_TLS=True
EMAIL_USER=${EMAIL_USER}
EMAIL_PASSWORD=${EMAIL_PASSWORD}
DEFAULT_FROM_EMAIL=noreply@${DOMAIN_NAME}

STRIPE_PUBLIC_KEY=${STRIPE_PUBLIC_KEY:-}
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY:-}
OPENAI_API_KEY=${OPENAI_API_KEY:-}
FIREBASE_CREDENTIALS=${FIREBASE_CREDENTIALS:-}
EOF
chmod 600 ${APP_DIR}/.env.production
chown ${APP_USER}:${APP_USER} ${APP_DIR}/.env.production"

# Configure nginx
echo -e "${GREEN}Configuring nginx...${NC}"
ssh root@"$DROPLET_IP" "cp ${APP_DIR}/deploy/digitalocean/nginx/numerai.conf /etc/nginx/sites-available/numerai.conf && \
sed -i 's/server_name _;/server_name ${DOMAIN_NAME} www.${DOMAIN_NAME};/g' /etc/nginx/sites-available/numerai.conf && \
ln -sf /etc/nginx/sites-available/numerai.conf /etc/nginx/sites-enabled/ && \
rm -f /etc/nginx/sites-enabled/default && \
nginx -t && systemctl reload nginx"

# Deploy application
echo -e "${GREEN}[10/10] Deploying application...${NC}"
ssh ${APP_USER}@"$DROPLET_IP" "cd ${APP_DIR} && bash deploy/digitalocean/deploy.sh"

# Install Celery services
echo -e "${GREEN}Installing Celery services...${NC}"
ssh root@"$DROPLET_IP" "cd ${APP_DIR} && bash deploy/digitalocean/systemd/install-services.sh && \
systemctl start celery-worker celery-beat && \
systemctl enable celery-worker celery-beat"

# Set up SSL (requires domain to be pointing to droplet)
echo -e "${YELLOW}Setting up SSL certificate...${NC}"
echo -e "${YELLOW}Note: Make sure ${DOMAIN_NAME} points to ${DROPLET_IP} before continuing${NC}"
echo "Waiting 30 seconds for DNS propagation..."
sleep 30

# Check if domain resolves to droplet IP
DOMAIN_IP=$(dig +short ${DOMAIN_NAME} | tail -n1)
if [ "$DOMAIN_IP" == "$DROPLET_IP" ]; then
    echo -e "${GREEN}DNS is configured correctly!${NC}"
    ssh root@"$DROPLET_IP" "cd ${APP_DIR} && bash -c 'echo -e \"${DOMAIN_NAME}\n${DOMAIN_EMAIL}\" | bash deploy/digitalocean/setup-ssl.sh'"
else
    echo -e "${YELLOW}DNS not yet configured (${DOMAIN_NAME} resolves to ${DOMAIN_IP}, expected ${DROPLET_IP})${NC}"
    echo -e "${YELLOW}Skipping SSL setup. Run manually after DNS is configured:${NC}"
    echo "ssh root@${DROPLET_IP} 'cd ${APP_DIR} && bash deploy/digitalocean/setup-ssl.sh'"
fi

# Summary
echo ""
echo -e "${GREEN}=========================================="
echo "Deployment Complete!"
echo "==========================================${NC}"
echo ""
echo "Droplet Information:"
echo "  ID: ${DROPLET_ID}"
echo "  IP: ${DROPLET_IP}"
echo "  Name: ${DROPLET_NAME}"
echo ""
echo "Application URLs:"
echo "  Frontend: http://${DROPLET_IP} (or https://${DOMAIN_NAME} after SSL)"
echo "  Backend API: http://${DROPLET_IP}/api/v1"
echo "  Health Check: http://${DROPLET_IP}/api/v1/health/"
echo ""
echo "SSH Access:"
echo "  ssh root@${DROPLET_IP}"
echo "  ssh ${APP_USER}@${DROPLET_IP}"
echo ""
echo "Next Steps:"
echo "1. Point ${DOMAIN_NAME} DNS A record to ${DROPLET_IP}"
echo "2. Set up SSL certificate (if not done):"
echo "   ssh root@${DROPLET_IP} 'cd ${APP_DIR} && bash deploy/digitalocean/setup-ssl.sh'"
echo "3. Create Django superuser:"
echo "   ssh ${APP_USER}@${DROPLET_IP} 'cd ${APP_DIR} && docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec backend python manage.py createsuperuser'"
echo "4. Test the application"
echo ""
echo -e "${GREEN}Deployment completed successfully!${NC}"

