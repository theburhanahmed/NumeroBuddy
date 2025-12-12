#!/bin/bash
# Install DigitalOcean CLI (doctl)
# Run this on your local machine before using auto-deploy.sh

set -e

OS="$(uname -s)"
ARCH="$(uname -m)"

echo "Installing doctl (DigitalOcean CLI)..."

case "$OS" in
    Linux)
        if [ "$ARCH" == "x86_64" ]; then
            cd /tmp
            wget https://github.com/digitalocean/doctl/releases/download/v1.104.0/doctl-1.104.0-linux-amd64.tar.gz
            tar xf doctl-1.104.0-linux-amd64.tar.gz
            sudo mv doctl /usr/local/bin
            echo "doctl installed successfully"
        else
            echo "Unsupported architecture. Please install doctl manually from https://github.com/digitalocean/doctl"
            exit 1
        fi
        ;;
    Darwin)
        if command -v brew &> /dev/null; then
            brew install doctl
        else
            echo "Homebrew not found. Please install doctl manually:"
            echo "brew install doctl"
            exit 1
        fi
        ;;
    *)
        echo "Unsupported OS. Please install doctl manually from https://github.com/digitalocean/doctl"
        exit 1
        ;;
esac

echo "Verifying installation..."
doctl version

echo ""
echo "Next steps:"
echo "1. Get your DigitalOcean API token from: https://cloud.digitalocean.com/account/api/tokens"
echo "2. Create deploy-config.env file (see auto-deploy.sh for template)"
echo "3. Run: ./auto-deploy.sh"

