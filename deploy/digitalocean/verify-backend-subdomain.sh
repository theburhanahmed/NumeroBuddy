#!/bin/bash
# Verification script for backend.numerobuddy.com configuration

echo "=========================================="
echo "Verifying backend.numerobuddy.com setup"
echo "=========================================="

# Check if nginx config exists
echo -e "\n[1/6] Checking nginx config file..."
if [ -f "/etc/nginx/sites-available/numerai.conf" ]; then
    echo "✓ Config file exists"
else
    echo "✗ Config file not found at /etc/nginx/sites-available/numerai.conf"
    exit 1
fi

# Check if backend.numerobuddy.com server block exists
echo -e "\n[2/6] Checking for backend.numerobuddy.com server block..."
if grep -q "server_name backend.numerobuddy.com" /etc/nginx/sites-available/numerai.conf; then
    echo "✓ Server block found"
    echo "Server block details:"
    grep -A 10 "server_name backend.numerobuddy.com" /etc/nginx/sites-available/numerai.conf | head -15
else
    echo "✗ Server block not found in config"
    echo "Please ensure the updated config file is on the server"
    exit 1
fi

# Check nginx config syntax
echo -e "\n[3/6] Testing nginx configuration..."
if sudo nginx -t 2>&1 | grep -q "syntax is ok"; then
    echo "✓ Nginx config syntax is valid"
else
    echo "✗ Nginx config has syntax errors:"
    sudo nginx -t
    exit 1
fi

# Check if config is symlinked
echo -e "\n[4/6] Checking if config is enabled..."
if [ -L "/etc/nginx/sites-enabled/numerai.conf" ]; then
    echo "✓ Config is symlinked (enabled)"
else
    echo "⚠ Config is not symlinked"
    echo "Run: sudo ln -s /etc/nginx/sites-available/numerai.conf /etc/nginx/sites-enabled/"
fi

# Reload nginx
echo -e "\n[5/6] Reloading nginx..."
if sudo systemctl reload nginx; then
    echo "✓ Nginx reloaded successfully"
else
    echo "✗ Failed to reload nginx"
    exit 1
fi

# Test the endpoint
echo -e "\n[6/6] Testing backend endpoint..."
echo "Testing with Host header..."

# Test 1: With Host header to localhost
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: backend.numerobuddy.com" http://localhost/api/v1/health/ 2>&1)
if [ "$RESPONSE" = "200" ] || [ "$RESPONSE" = "301" ] || [ "$RESPONSE" = "302" ]; then
    echo "✓ Test with Host header: HTTP $RESPONSE (success)"
else
    echo "✗ Test with Host header: HTTP $RESPONSE"
    echo "Full response:"
    curl -v -H "Host: backend.numerobuddy.com" http://localhost/api/v1/health/ 2>&1 | head -20
fi

# Test 2: If /etc/hosts has entry, test with domain name
if grep -q "backend.numerobuddy.com" /etc/hosts 2>/dev/null; then
    echo -e "\nTesting with actual domain name..."
    RESPONSE2=$(curl -s -o /dev/null -w "%{http_code}" http://backend.numerobuddy.com/api/v1/health/ 2>&1)
    if [ "$RESPONSE2" = "200" ] || [ "$RESPONSE2" = "301" ] || [ "$RESPONSE2" = "302" ]; then
        echo "✓ Test with domain name: HTTP $RESPONSE2 (success)"
    else
        echo "✗ Test with domain name: HTTP $RESPONSE2"
    fi
else
    echo -e "\n⚠ backend.numerobuddy.com not in /etc/hosts - skipping domain test"
    echo "To test with domain name, add to /etc/hosts:"
    echo "  echo '127.0.0.1 backend.numerobuddy.com' | sudo tee -a /etc/hosts"
fi

# Check nginx logs
echo -e "\n[Debug] Recent nginx error logs for backend API:"
sudo tail -5 /var/log/nginx/backend-api-error.log 2>/dev/null || echo "No backend API error log yet"

echo -e "\n[Debug] Recent nginx access logs for backend API:"
sudo tail -5 /var/log/nginx/backend-api-access.log 2>/dev/null || echo "No backend API access log yet"

echo -e "\n=========================================="
echo "Verification complete!"
echo "=========================================="
echo ""
echo "If tests failed, check:"
echo "1. Is the updated numerai.conf file on the server?"
echo "2. Has nginx been reloaded after config changes?"
echo "3. Is DNS configured for backend.numerobuddy.com?"
echo "4. Check nginx error logs: sudo tail -50 /var/log/nginx/error.log"

