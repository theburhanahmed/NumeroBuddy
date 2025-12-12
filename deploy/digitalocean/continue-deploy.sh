#!/bin/bash
# Continue deployment on existing droplet

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Load config
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/deploy-config.env"

# Get existing droplet
DROPLET_ID=536446269
DROPLET_IP=$(doctl compute droplet get $DROPLET_ID --format PublicIPv4 --no-header)
APP_DIR=/opt/numerai
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo -e "${GREEN}Continuing deployment on existing droplet...${NC}"
echo "Droplet IP: $DROPLET_IP"

# Accept SSH host key
ssh-keyscan -H "$DROPLET_IP" >> ~/.ssh/known_hosts 2>/dev/null || true

# Copy deployment files
echo -e "${GREEN}Copying deployment files...${NC}"
ssh root@"$DROPLET_IP" "mkdir -p /tmp/numerai-deploy"
scp -r "${PROJECT_ROOT}/deploy" root@"$DROPLET_IP":/tmp/numerai-deploy/
scp "${PROJECT_ROOT}/docker-compose.yml" root@"$DROPLET_IP":/tmp/numerai-deploy/
scp "${PROJECT_ROOT}/docker-compose.prod.yml" root@"$DROPLET_IP":/tmp/numerai-deploy/ 2>/dev/null || true

# Run server setup
echo -e "${GREEN}Running server setup...${NC}"
ssh root@"$DROPLET_IP" "cd /tmp/numerai-deploy && chmod +x deploy/digitalocean/*.sh && bash deploy/digitalocean/setup-server.sh"

# Clone repository
echo -e "${GREEN}Cloning repository...${NC}"
ssh root@"$DROPLET_IP" "rm -rf ${APP_DIR} && git clone -b ${GIT_BRANCH} ${GIT_REPO} ${APP_DIR} && chown -R ${APP_USER}:${APP_USER} ${APP_DIR}"

# Generate secrets
SECRET_KEY=$(python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())" 2>/dev/null || openssl rand -hex 32)
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

# Create environment file
echo -e "${GREEN}Configuring environment...${NC}"
ssh root@"$DROPLET_IP" "cat > ${APP_DIR}/.env.production << 'ENV_EOF'
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
EMAIL_USER=${EMAIL_USER:-}
EMAIL_PASSWORD=${EMAIL_PASSWORD:-}
DEFAULT_FROM_EMAIL=noreply@${DOMAIN_NAME}

STRIPE_PUBLIC_KEY=${STRIPE_PUBLIC_KEY:-}
STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY:-}
OPENAI_API_KEY=${OPENAI_API_KEY:-}
FIREBASE_CREDENTIALS=${FIREBASE_CREDENTIALS:-}
ENV_EOF
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
echo -e "${GREEN}Deploying application...${NC}"
ssh ${APP_USER}@"$DROPLET_IP" "cd ${APP_DIR} && bash deploy/digitalocean/deploy.sh"

# Install Celery services
echo -e "${GREEN}Installing Celery services...${NC}"
ssh root@"$DROPLET_IP" "cd ${APP_DIR} && bash deploy/digitalocean/systemd/install-services.sh && \
systemctl start celery-worker celery-beat && \
systemctl enable celery-worker celery-beat"

echo -e "${GREEN}Deployment complete!${NC}"
echo "Droplet IP: $DROPLET_IP"
echo "Domain: $DOMAIN_NAME"
