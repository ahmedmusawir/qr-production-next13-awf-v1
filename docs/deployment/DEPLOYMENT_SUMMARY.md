# Deployment Summary — QR Ticketing App

## Application Overview

The QR Ticketing App is a Next.js 13 application with a custom Express + Socket.IO production server. It provides QR code–based event ticketing, an admin portal, and real-time sync status updates. Authentication is handled through Supabase. External CRM data is sourced via GoHighLevel (GHL).

The application runs on a custom Node.js production server (`server.prod.js`) rather than the standard Next.js server. This is required because the app embeds a Socket.IO WebSocket server into the same HTTP process.

---

## Production URL

```
https://qrtickets.cyberizewebdevelopment.com
```

---

## Deployment Architecture

```
Internet (HTTPS :443)
        │
        ▼
   Nginx (reverse proxy)
   /etc/nginx/sites-available/qrtickets.cyberizewebdevelopment.com
        │
        │  proxy_pass → localhost:4004
        ▼
   Docker Container: qr-app
   Port: 4004
   Entry: node server.prod.js
        │
        ├── Next.js 13 (page rendering, API routes)
        ├── Express (HTTP server layer)
        └── Socket.IO (WebSocket, same port)
```

---

## Infrastructure

| Component         | Details                                              |
|-------------------|------------------------------------------------------|
| Host              | DigitalOcean droplet                                 |
| Server IP         | 157.230.43.210                                       |
| OS                | Ubuntu (Debian-based)                                |
| App path on host  | `~/nextjs_apps/qrapp_prod/qr-production-next13-awf-v1` |
| Container runtime | Docker                                               |
| Container name    | `qr-app`                                             |
| Internal port     | 4004                                                 |
| Reverse proxy     | Nginx                                                |
| SSL               | Let's Encrypt via Certbot                            |
| SSL cert path     | `/etc/letsencrypt/live/qrtickets.cyberizewebdevelopment.com/` |
| SSL expiry        | 2026-06-13 (auto-renews via certbot cron)            |
| Branch deployed   | `main`                                               |

---

## Key Components

### Docker
The application is containerized using a `node:20-slim` base image. The build step runs `next build` inside the container. All `NEXT_PUBLIC_*` environment variables must be passed as Docker build arguments at image build time — they are frozen into the client-side JavaScript bundle and cannot be changed at runtime.

### Nginx
Nginx acts as the public-facing reverse proxy. It terminates SSL on port 443 and forwards all traffic to the Docker container at `localhost:4004`. It also handles the HTTP → HTTPS redirect on port 80.

### Certbot / Let's Encrypt
SSL certificates are issued by Let's Encrypt and managed by Certbot. Renewal is automatic via a Certbot-installed system timer or cron job. No manual renewal is required under normal circumstances.

### Supabase
Used for authentication (server-side session management) and database operations. The Supabase browser client is initialized using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, both of which must be baked into the build. The service role key (`SUPABASE_SERVICE_ROLE_KEY`) is server-side only and provided at container runtime via `.env.production`.

### Socket.IO
Real-time sync status is pushed to connected browser clients via Socket.IO. The WebSocket server shares the same port (4004) as the HTTP server, which is why a custom Express-based server is used instead of the standard Next.js server.

---

## High-Level Deployment Flow

1. Ensure `.env.production` is present on the server with all required variables.
2. Pull latest code from the `main` branch.
3. Run `./docker-build.sh` — this sources `.env.production`, bakes all `NEXT_PUBLIC_*` vars into the image, and runs `next build` inside the container.
4. Run `./server-stop.sh` to remove any existing container.
5. Run `./server-start.sh` to start the new container on port 4004.
6. Nginx and SSL are already in place — no reconfiguration needed on re-deploy.
7. Verify with `docker logs -f qr-app` and check the live URL.

---

## Scripts Reference

| Script                  | Purpose                                                     |
|-------------------------|-------------------------------------------------------------|
| `./docker-build.sh`     | Build production image `qr-app` from `.env.production`     |
| `./server-start.sh`     | Start `qr-app` container on port 4004                       |
| `./server-stop.sh`      | Stop and remove `qr-app` container                          |
| `./docker-build-local.sh`   | Build local image `qr-app-local` from `.env.local`      |
| `./server-start-local.sh`   | Start `qr-app-local` container on port 4004             |
| `./server-stop-local.sh`    | Stop and remove `qr-app-local` container                |
