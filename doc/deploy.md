# Deployment Guide — QR Ticketing App

**Server:** 157.230.43.210
**URL:** https://qrtickets.cyberizewebdevelopment.com
**App path on DO box:** ~/nextjs_apps/qrapp_prod/qr-production-next13-awf-v1

---

## Re-deploy after code changes

```bash
# 1. SSH into the DO box
ssh root@157.230.43.210

# 2. Go to the app directory
cd ~/nextjs_apps/qrapp_prod/qr-production-next13-awf-v1

# 3. Pull latest code
git pull

# 4. Stop the running container
./server-stop.sh

# 5. Rebuild the Docker image (sources .env.production automatically)
./docker-build.sh

# 6. Start the container
./server-start.sh

# 7. Verify it's running
docker logs -f qr-app
```

Hit Ctrl+C to exit the log stream. App is up at https://qrtickets.cyberizewebdevelopment.com

---

## Scripts reference

| Script              | What it does                                                                                  |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `./docker-build.sh` | Builds `qr-app` image — sources `.env.production`, bakes all `NEXT_PUBLIC_*` vars into bundle |
| `./server-start.sh` | Runs container named `qr-app` on port 4004, uses `.env.production` for runtime secrets        |
| `./server-stop.sh`  | Stops and removes the `qr-app` container                                                      |

---

## Troubleshooting

**Container won't stop (wrong name):**

```bash
docker ps                          # find the actual container name
docker stop <name> && docker rm <name>
```

**Check if app is running:**

```bash
docker ps
docker logs -f qr-app
```

**nginx reload after config change:**

```bash
nginx -t && systemctl reload nginx
```

---

## SSL — auto-renews via certbot (no action needed)

Certificate path: `/etc/letsencrypt/live/qrtickets.cyberizewebdevelopment.com/`
Expires: 2026-06-13 (auto-renewed by certbot scheduled task)

**To manually renew:**

```bash
certbot renew --dry-run   # test
certbot renew             # actual renewal
```

---

## nginx config location

`/etc/nginx/sites-available/qrtickets.cyberizewebdevelopment.com`

**To update nginx config:**

```bash
vim /etc/nginx/sites-available/qrtickets.cyberizewebdevelopment.com
nginx -t
systemctl reload nginx
```

---

## Phase 2 complete checklist

- [x] Docker production build
- [x] nginx reverse proxy (443 → localhost:4004)
- [x] SSL via Let's Encrypt (certbot)
- [x] Live at https://qrtickets.cyberizewebdevelopment.com
