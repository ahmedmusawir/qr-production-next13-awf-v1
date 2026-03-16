# Deployment Checklist

Use this checklist before every production deployment.

---

## Environment Preparation

- [ ] `.env.production` is present on the server at the project root
- [ ] All `NEXT_PUBLIC_*` variables are populated in `.env.production`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is present in `.env.production`
- [ ] No secret values are committed to version control

---

## Code Readiness

- [ ] All changes are pushed to the `main` branch
- [ ] The Docker build has been tested locally using `./docker-build-local.sh`
- [ ] No Next.js API routes that access server-only env vars at build time are missing `export const dynamic = "force-dynamic"`
- [ ] No network calls to external services occur at static render time in `app/layout.tsx` or similar layout files

---

## Docker Readiness

- [ ] Docker is installed and running on the droplet (`docker --version`)
- [ ] Previous container is stopped before rebuilding (`./server-stop.sh`)
- [ ] Build script sources `.env.production` and passes all `NEXT_PUBLIC_*` as build args
- [ ] Image builds successfully without errors

---

## Nginx Readiness

- [ ] Nginx config exists at `/etc/nginx/sites-available/qrtickets.cyberizewebdevelopment.com`
- [ ] Site is symlinked into `sites-enabled`
- [ ] Config includes `Upgrade` and `Connection` headers for WebSocket (Socket.IO) support
- [ ] `nginx -t` passes before reloading

---

## Domain Readiness

- [ ] DNS A record for `qrtickets.cyberizewebdevelopment.com` points to `157.230.43.210`
- [ ] DNS propagation is confirmed (`dig qrtickets.cyberizewebdevelopment.com +short`)

---

## SSL Readiness

- [ ] SSL certificate is issued and valid (`certbot certificates`)
- [ ] Auto-renewal is verified (`certbot renew --dry-run`)
- [ ] Certificate expiry date is noted (current: 2026-06-13)

---

## Deployment Steps (in order)

- [ ] `ssh root@157.230.43.210`
- [ ] `cd ~/nextjs_apps/qrapp_prod/qr-production-next13-awf-v1`
- [ ] `git pull`
- [ ] `./server-stop.sh`
- [ ] `./docker-build.sh`
- [ ] `./server-start.sh`

---

## Verification Steps

- [ ] `docker ps` — container `qr-app` is running
- [ ] `docker logs -f qr-app` — server started on port 4004, no startup errors
- [ ] `curl -s -o /dev/null -w "%{http_code}" http://localhost:4004` — returns `200`
- [ ] `https://qrtickets.cyberizewebdevelopment.com` — loads in browser with SSL padlock
- [ ] Admin portal loads with real data (not blank, not `undefined`)
- [ ] Browser console has no errors about undefined environment variables
- [ ] WebSocket connection established (browser DevTools → Network → WS)
