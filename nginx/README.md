# Nginx Configuration for Portfolio Apps (Client + Admin)

This directory contains nginx configuration files for deploying both the Next.js client and admin apps on a home server using subdomains.

## Subdomain Setup

The configuration supports:
- **portfolio.mydomain.com** - Client app (port 5173)
- **portfolioAdmin.mydomain.com** - Admin app (port 5174)

## Quick Start

1. **Replace placeholders** in `portfolio-client.conf`:
   - Replace `mydomain.com` with your actual domain name (multiple places)
   - Update `/path/to/portfolio/apps/client/` with your actual client app path
   - Update `/path/to/portfolio/apps/admin/` with your actual admin app path
   - Update `proxy_pass http://localhost:5173;` if client app runs on a different port
   - Update `proxy_pass http://localhost:5174;` if admin app runs on a different port

2. **Copy configuration** to nginx:
   ```bash
   sudo cp nginx/portfolio-client.conf /etc/nginx/sites-available/portfolio-client
   sudo ln -s /etc/nginx/sites-available/portfolio-client /etc/nginx/sites-enabled/
   ```

3. **Test configuration**:
   ```bash
   sudo nginx -t
   ```

4. **Reload nginx**:
   ```bash
   sudo systemctl reload nginx
   # or
   sudo nginx -s reload
   ```

## SSL Certificate Setup with Let's Encrypt

### Prerequisites

Before obtaining an SSL certificate, ensure:
- Your domain DNS A record points to your home server's public IP address
- Port 80 is open and accessible from the internet (for Let's Encrypt validation)
- Your Next.js app is running on the configured port (default: 5173)

### Step 1: Install Certbot

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

**CentOS/RHEL:**
```bash
sudo yum install certbot python3-certbot-nginx
```

**Fedora:**
```bash
sudo dnf install certbot python3-certbot-nginx
```

### Step 2: Obtain SSL Certificates

You have two options for SSL certificates:

**Option A: Separate Certificates for Each Subdomain (Recommended for flexibility)**
```bash
# Certificate for client app
sudo certbot --nginx -d portfolio.mydomain.com

# Certificate for admin app
sudo certbot --nginx -d portfolioAdmin.mydomain.com
```

**Option B: Wildcard Certificate (Single certificate for all subdomains)**
```bash
# Get wildcard certificate (requires DNS challenge)
sudo certbot certonly --manual --preferred-challenges dns -d "*.mydomain.com" -d mydomain.com
```

For wildcard certificates, you'll need to:
1. Add a TXT record to your DNS as instructed by certbot
2. Wait for DNS propagation
3. Complete the certificate request
4. Update both server blocks to use the same certificate:
   - `ssl_certificate /etc/letsencrypt/live/mydomain.com/fullchain.pem;`
   - `ssl_certificate_key /etc/letsencrypt/live/mydomain.com/privkey.pem;`

**Option C: Standalone mode (if nginx isn't running yet)**
```bash
sudo certbot certonly --standalone -d portfolio.mydomain.com
sudo certbot certonly --standalone -d portfolioAdmin.mydomain.com
```

Then manually update `portfolio-client.conf` with the certificate paths for each server block.

### Step 3: Verify Certificate

Test that your certificate is working:
```bash
sudo certbot certificates
```

Visit your site: `https://example.com`

### Step 4: Set Up Auto-Renewal

Let's Encrypt certificates expire every 90 days. Set up automatic renewal:

**Test renewal:**
```bash
sudo certbot renew --dry-run
```

**Set up systemd timer (usually pre-configured):**
```bash
sudo systemctl status certbot.timer
```

If not enabled, enable it:
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

**Or set up cron job:**
```bash
sudo crontab -e
```

Add this line (runs twice daily):
```
0 0,12 * * * certbot renew --quiet
```

**Reload nginx after renewal:**
Create a renewal hook to reload nginx automatically:
```bash
sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy
sudo nano /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
```

Add:
```bash
#!/bin/bash
systemctl reload nginx
```

Make it executable:
```bash
sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh
```

## Important Configuration Notes

### Port Forwarding

Ensure your router forwards:
- **Port 80 (HTTP)** → Your server's local IP
- **Port 443 (HTTPS)** → Your server's local IP

### DNS Configuration

Before obtaining SSL certificates:
1. Create A records for each subdomain pointing to your home server's public IP:
   - `portfolio.mydomain.com` → Your server's public IP
   - `portfolioAdmin.mydomain.com` → Your server's public IP
2. If using wildcard certificate, also add:
   - `*.mydomain.com` → Your server's public IP (or use CNAME)
3. Wait for DNS propagation (can take up to 48 hours, usually much faster)
4. Verify DNS:
   ```bash
   dig portfolio.mydomain.com
   dig portfolioAdmin.mydomain.com
   # or
   nslookup portfolio.mydomain.com
   nslookup portfolioAdmin.mydomain.com
   ```

### Firewall Configuration

**UFW (Ubuntu):**
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw reload
```

**firewalld (CentOS/RHEL/Fedora):**
```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

**iptables:**
```bash
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables-save
```

### Next.js Apps Setup

**Client App (portfolio.mydomain.com):**

1. **Build the client app:**
   ```bash
   cd apps/client
   npm run build
   ```

2. **Run in production mode:**
   ```bash
   PORT=5173 npm start
   ```

3. **Or use PM2 for process management:**
   ```bash
   npm install -g pm2
   cd apps/client
   pm2 start npm --name "portfolio-client" -- start -- --port 5173
   pm2 save
   ```

**Admin App (portfolioAdmin.mydomain.com):**

1. **Build the admin app:**
   ```bash
   cd apps/admin
   npm run build
   ```

2. **Run in production mode:**
   ```bash
   PORT=5174 npm start
   ```

3. **Or use PM2 for process management:**
   ```bash
   cd apps/admin
   pm2 start npm --name "portfolio-admin" -- start -- --port 5174
   pm2 save
   ```

**Note:** Make sure both apps are running on different ports (5173 for client, 5174 for admin) as configured in the nginx config.

### Static Files Paths

Update the static file paths in `portfolio-client.conf`:

**Client App (portfolio.mydomain.com):**
- `/_next/static/` should point to: `/path/to/portfolio/apps/client/.next/static/`
- `/public/` should point to: `/path/to/portfolio/apps/client/public/`

**Admin App (portfolioAdmin.mydomain.com):**
- `/_next/static/` should point to: `/path/to/portfolio/apps/admin/.next/static/`
- `/public/` should point to: `/path/to/portfolio/apps/admin/public/`

Replace `/path/to/portfolio/` with your actual project path on the server.

## Troubleshooting

### Check nginx error logs:
```bash
sudo tail -f /var/log/nginx/error.log
```

### Check nginx access logs:
```bash
sudo tail -f /var/log/nginx/access.log
```

### Verify Next.js is running:
```bash
curl http://localhost:5173
```

### Test SSL configuration:
```bash
openssl s_client -connect example.com:443 -servername example.com
```

### Common Issues:

1. **502 Bad Gateway**: Next.js app not running or wrong port in proxy_pass
   - Check if client app is running on port 5173: `curl http://localhost:5173`
   - Check if admin app is running on port 5174: `curl http://localhost:5174`
2. **SSL certificate errors**: DNS not pointing correctly or certificate not obtained
   - Verify DNS records are correct
   - Ensure certificates are obtained for both subdomains
3. **Static files 404**: Incorrect path in location blocks
   - Verify paths point to correct app directories
   - Ensure apps have been built (`npm run build`)
4. **Connection refused**: Firewall blocking ports or Next.js not listening
   - Check if both apps are running: `pm2 list` or `ps aux | grep node`
   - Verify ports are not blocked by firewall
5. **Wrong app loads on subdomain**: Server blocks may be in wrong order or server_name mismatch
   - Verify server_name matches your subdomain exactly
   - Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`

## Security Considerations

- Keep nginx and certbot updated: `sudo apt update && sudo apt upgrade`
- Regularly check SSL certificate expiration: `sudo certbot certificates`
- Monitor nginx logs for suspicious activity
- Consider setting up fail2ban for additional security
- Review and adjust security headers in the configuration as needed

## Performance Optimization

The configuration includes:
- Gzip compression for text-based files
- Cache headers for static assets (365 days for `/_next/static/`, 30 days for `/public/`)
- HTTP/2 support
- Optimized proxy settings for Next.js

For production, consider:
- Enabling nginx caching for API responses (if applicable)
- Setting up CDN for static assets
- Using nginx's rate limiting for DDoS protection

