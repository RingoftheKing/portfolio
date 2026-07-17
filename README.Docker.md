# Docker Setup for Portfolio Application

This document describes how to run the portfolio application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- (Optional) Make sure ports 3000, 3001, and 5432 are available

## Quick Start
Open Docker if you haven't already. The Engine needs to be running

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Build and start all services:**
   ```bash
   docker-compose up -d
   ```

   Or use npm scripts:
   ```bash
   npm run docker:build
   npm run docker:up
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop all services:**
   ```bash
   docker-compose down
   ```

## Services

- **postgres**: PostgreSQL 16 database (port 5432)
- **server**: Backend API server (port 3000)
- **client**: Next.js client app (port 3000)
- **admin**: Next.js admin app (port 3001)
- **nginx**: Reverse proxy (ports 80 and 443)

## HTTPS / SSL (port 443)

Port 443 only works if Nginx has (Cloudflare) certificates. Without them, Nginx will fail to start.

1. **Create a `certs` directory** in the project root and place:
   - `origin.pem` – certificate (e.g. from Let's Encrypt)
   - `privkey.key` – private key

2. **Example with Let's Encrypt (certbot)** on the host:
   ```bash
   certbot certonly --standalone -d portfolio.kingofthering.me -d admin.kingofthering.me
   # Then copy or symlink:
   # cp /etc/letsencrypt/live/portfolio.kingofthering.me/fullchain.pem certs/
   # cp /etc/letsencrypt/live/portfolio.kingofthering.me/privkey.pem certs/
   ```
   Or mount the Let's Encrypt live directory in `docker-compose.yml` instead of `./certs`:
   ```yaml
   - /etc/letsencrypt/live/portfolio.kingofthering.me:/etc/nginx/ssl:ro
   ```
   (Use the path where certbot stored the certs for your domain.)

3. **HTTP only (no HTTPS):** Comment out the two "HTTPS (port 443)" server blocks in `nginx/nginx.docker.conf` and remove the `./certs:/etc/nginx/ssl:ro` volume from the nginx service in `docker-compose.yml`. Then only port 80 will be used.

## Environment Variables

Create a `.env` file in the root directory based on `.env.example`. Key variables:

- Database credentials (DB_NAME, DB_USER, DB_PASSWORD)
- Port configurations
- API URLs for client/admin apps

## Docker Commands

```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f server

# Restart a service
docker-compose restart server

# Remove containers and volumes (clean slate)
docker-compose down -v
```

## Development

For local development, you may want to run services individually:

- **Server**: `cd apps/server && npm run dev`
- **Client**: `cd apps/client && npm run dev`
- **Admin**: `cd apps/admin && npm run dev`
- **Postgres**: Use docker-compose or local PostgreSQL installation

## Troubleshooting

1. **Port conflicts**: Change ports in `.env` or `docker-compose.yml`
2. **Database connection errors**: Ensure postgres service is healthy before server starts
3. **Build failures**: Clear Docker cache: `docker system prune -a`
4. **Permission errors**: Ensure Docker has proper permissions

## Health Checks

All services include health checks. Check status:
```bash
docker-compose ps
```

Services with "healthy" status are ready to accept connections.

