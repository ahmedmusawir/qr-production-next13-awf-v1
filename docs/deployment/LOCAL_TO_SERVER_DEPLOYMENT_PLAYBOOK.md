# Local to Server Deployment Playbook

This playbook describes the exact deployment process used to take the QR Ticketing App from local development to a live production environment on a DigitalOcean droplet with Docker, Nginx, and SSL.

---

## Prerequisites

- SSH access to the DigitalOcean droplet (`root@157.230.43.210`)
- Docker installed on both local machine and the droplet
- Nginx installed on the droplet
- Certbot installed on the droplet
- Domain DNS A record pointing to the droplet IP
- `.env.production` file present on the server (not committed to version control)

---

## Phase 1 — Local Development Preparation

### 1.1 Confirm the application runs locally

Before deploying, verify the application works in development mode:

```bash
npm run dev
```

Expected: Application starts at `http://localhost:3000` (or configured dev port) without errors.

### 1.2 Confirm `.env.local` is complete

All variables required for local development must be present in `.env.local`. This file is used by the local Docker build scripts.

### 1.3 Test the local Docker build

Before deploying to the server, validate the Docker build works locally using the local build scripts:

```bash
./docker-build-local.sh
```

Expected output:
```
🔨 Building local image: qr-app-local
   NEXT_PUBLIC_API_BASE_URL    = http://localhost:4004
   ...
✅ Build complete: qr-app-local
```

The build runs `next build` inside the container. If it fails, fix all build errors before proceeding to the server.

### 1.4 Run the local container

```bash
./server-start-local.sh
```

Expected: Container starts, app accessible at `http://localhost:4004`.

Verify core functionality:
- Home page loads
- Admin portal loads and displays data
- No console errors for undefined environment variables

### 1.5 Stop the local container

```bash
./server-stop-local.sh
```

---

## Phase 2 — Preparing the DigitalOcean Droplet

### 2.1 SSH into the droplet

```bash
ssh root@157.230.43.210
```

### 2.2 Install Docker (if not already installed)

```bash
apt update
apt install -y docker.io
systemctl enable docker
systemctl start docker
```

Verify:
```bash
docker --version
```

### 2.3 Install Nginx (if not already installed)

```bash
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

### 2.4 Install Certbot (if not already installed)

```bash
apt install -y certbot python3-certbot-nginx
```

### 2.5 Create the application directory

```bash
mkdir -p ~/nextjs_apps/qrapp_prod
cd ~/nextjs_apps/qrapp_prod
```

### 2.6 Clone the repository

```bash
git clone <repository-url> qr-production-next13-awf-v1
cd qr-production-next13-awf-v1
```

### 2.7 Place the `.env.production` file

The `.env.production` file must be present in the project root on the server. It contains all server-side secrets and runtime environment variables. Transfer it securely — do not commit it to version control.

```bash
# Transfer from local machine using scp:
scp .env.production root@157.230.43.210:~/nextjs_apps/qrapp_prod/qr-production-next13-awf-v1/.env.production
```

---

## Phase 3 — Docker Build on the Server

### 3.1 Navigate to the project directory

```bash
cd ~/nextjs_apps/qrapp_prod/qr-production-next13-awf-v1
```

### 3.2 Run the production Docker build

```bash
./docker-build.sh
```

What this script does:
1. Checks that `.env.production` exists
2. Sources `.env.production` to load all `NEXT_PUBLIC_*` variables into the shell environment
3. Overrides `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_SOCKET_URL` with the production HTTPS domain
4. Runs `docker build` passing all six `NEXT_PUBLIC_*` vars as `--build-arg` arguments
5. Inside the container, `next build` runs with those vars baked into the client bundle

Expected output ends with:
```
✅ Build complete: qr-app
```

> **Critical:** The `next build` inside Docker runs without access to `.env.production`. All `NEXT_PUBLIC_*` values must arrive via `--build-arg`. The `docker-build.sh` script handles this. Do not skip it.

### 3.3 Verify the image was created

```bash
docker images | grep qr-app
```

Expected: `qr-app` image listed with a recent timestamp.

---

## Phase 4 — Running the Container on the Server

### 4.1 Stop any existing container

```bash
./server-stop.sh
```

If no container is running, the script outputs a warning and exits cleanly — this is normal.

### 4.2 Start the production container

```bash
./server-start.sh
```

What this script does:
- Starts a container named `qr-app` from the `qr-app` image
- Maps host port `4004` → container port `4004`
- Passes `.env.production` as the runtime environment file (server-side secrets)
- Sets `--restart unless-stopped` so the container survives droplet reboots

### 4.3 Verify the container is running

```bash
docker ps
```

Expected: `qr-app` listed as running.

### 4.4 Check application logs

```bash
docker logs -f qr-app
```

Expected log output:
```
Server running on http://localhost:4004
Socket.IO server running on ws://localhost:4004
```

Press `Ctrl+C` to exit the log stream.

### 4.5 Confirm the app responds locally on the droplet

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:4004
```

Expected: `200`

---

## Phase 5 — Nginx Reverse Proxy Setup

### 5.1 Create the Nginx site configuration

```bash
vim /etc/nginx/sites-available/qrtickets.cyberizewebdevelopment.com
```

Paste the following configuration:

```nginx
server {
    listen 80;
    server_name qrtickets.cyberizewebdevelopment.com;

    location / {
        proxy_pass http://localhost:4004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

> The `Upgrade` and `Connection` headers are required for Socket.IO WebSocket support.

### 5.2 Enable the site

```bash
ln -s /etc/nginx/sites-available/qrtickets.cyberizewebdevelopment.com \
      /etc/nginx/sites-enabled/qrtickets.cyberizewebdevelopment.com
```

### 5.3 Test the Nginx configuration

```bash
nginx -t
```

Expected:
```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 5.4 Reload Nginx

```bash
systemctl reload nginx
```

---

## Phase 6 — Domain Configuration

Ensure the domain's DNS A record points to the droplet IP before running Certbot.

| Record | Value          |
|--------|----------------|
| Type   | A              |
| Name   | qrtickets      |
| Value  | 157.230.43.210 |

DNS propagation can take up to 24–48 hours. Verify the record resolves before proceeding:

```bash
dig qrtickets.cyberizewebdevelopment.com +short
```

Expected: `157.230.43.210`

---

## Phase 7 — SSL Certificate Setup

### 7.1 Run Certbot

```bash
certbot --nginx -d qrtickets.cyberizewebdevelopment.com
```

Certbot will:
1. Verify domain ownership via HTTP challenge
2. Issue an SSL certificate from Let's Encrypt
3. Automatically update the Nginx configuration to redirect HTTP → HTTPS and serve on port 443

### 7.2 Confirm the certificate was issued

```bash
certbot certificates
```

Expected output includes:
```
Certificate Name: qrtickets.cyberizewebdevelopment.com
Expiry Date: 2026-06-13
```

### 7.3 Verify automatic renewal

Certbot installs a system timer or cron job for automatic renewal. Verify it:

```bash
certbot renew --dry-run
```

Expected: Simulated renewal completes without errors.

---

## Phase 8 — Deployment Verification

### 8.1 Check the live URL

Open in a browser:
```
https://qrtickets.cyberizewebdevelopment.com
```

Verify:
- SSL padlock is shown
- Home page loads without errors
- No browser console errors for `undefined` environment variables

### 8.2 Verify the admin portal

Navigate to the admin portal and confirm:
- User list loads correctly
- Search and pagination work
- No blank data panels

### 8.3 Verify Socket.IO

Open browser developer tools → Network → WS. Confirm a WebSocket connection is established to `wss://qrtickets.cyberizewebdevelopment.com`.

---

## Re-deploy After Code Changes

Once the initial setup is complete, subsequent deploys require only 6 commands:

```bash
ssh root@157.230.43.210
cd ~/nextjs_apps/qrapp_prod/qr-production-next13-awf-v1
git pull
./server-stop.sh
./docker-build.sh
./server-start.sh
```

Nginx and SSL require no changes on re-deploy unless the domain or port changes.
