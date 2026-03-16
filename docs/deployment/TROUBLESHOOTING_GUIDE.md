# Troubleshooting Guide

All issues documented here were encountered and resolved during the initial production deployment of the QR Ticketing App to DigitalOcean. Each entry includes the exact cause and the fix that worked.

---

## Issue 1 — Docker Build Exits With Code 1 on API Routes

**Problem**

`docker build` fails during `next build` with a non-zero exit code. The error points to a specific API route file (e.g., `app/api/admin/route.ts`).

**Cause**

Next.js attempts to statically render API routes at build time by default. If a route accesses a server-only environment variable (such as `SUPABASE_SERVICE_ROLE_KEY`) that is only available at runtime, its value is `undefined` during the Docker build. This causes Next.js to fail the build.

This issue does not appear in local development because `.env.local` is loaded automatically, making the variable available during `next build` locally. Inside Docker, no `.env` files are loaded during the build step — only `--build-arg` values are available.

**Solution**

Add the following export to the top of any API route that accesses server-only environment variables:

```typescript
export const dynamic = "force-dynamic";
```

This tells Next.js to skip static rendering for that route and only render it at request time when the runtime environment is available.

**Affected routes in this project:**

- `app/api/admin/route.ts`
- `app/api/ghl/events/route.ts`
- `app/api/ghl/price/route.ts`
- `app/api/ghl/orders/route.ts`
- `app/api/qrapp/timer/route.ts`
- `app/api/qrapp/sync-status/route.ts`
- `app/api/qrapp/orders/total-orders/route.ts`

**Prevention**

Any new API route that reads from `process.env` (non-`NEXT_PUBLIC_*` variables) should include `export const dynamic = "force-dynamic"` as a matter of convention.

---

## Issue 2 — Build Hangs or Times Out on Layout File

**Problem**

`docker build` appears to hang or takes an abnormally long time (10+ seconds per page) and may eventually time out or produce network-related errors.

**Cause**

`app/layout.tsx` was an async component that called external network services (e.g., `fetchAndGenerateTicketTypes()`, `fetchAndGenerateValidOrderList()`) at render time during static generation. Inside Docker, these services are unreachable, causing each call to time out before the build could proceed. Because the layout wraps every page, the timeout multiplied across every statically rendered route.

**Solution**

Add `export const dynamic = "force-dynamic"` to `app/layout.tsx`. This prevents Next.js from statically rendering the layout and defers all data fetching to request time.

**Prevention**

Avoid making network calls to external services in layout files. If data is needed in a layout, fetch it inside a Server Component child or use a route-level data fetching pattern.

---

## Issue 3 — ERR_TOO_MANY_REDIRECTS on Fresh Server

**Problem**

Opening the production URL in a browser returns a `ERR_TOO_MANY_REDIRECTS` error. The page never loads.

**Cause**

The Supabase middleware (`utils/supabase/middleware.ts`) contained a redirect: any unauthenticated request was redirected to `/login`. However, the application has no `/login` page. On a local machine, the developer was already authenticated (Supabase session cookie present), so the redirect never fired. On a fresh server with no session, the request chain was:

```
Request → middleware detects no session → redirect to /login
/login → middleware detects no session → redirect to /login
... infinite loop
```

**Solution**

Removed the redirect from the middleware entirely. The middleware now only refreshes the Supabase session token and passes the request through. Authentication protection is handled at the page level, not in global middleware.

```typescript
// middleware now only does this:
await supabase.auth.getUser();
return supabaseResponse;
```

Additionally, `login` was added to the middleware matcher exclusion list to prevent the middleware from processing requests to the login path.

**Prevention**

Never add blanket redirect logic in Next.js middleware without verifying that the redirect target exists and that the middleware itself is excluded from triggering on that target path.

---

## Issue 4 — Admin Portal Shows No Data (Blank User List)

**Problem**

The admin portal loads successfully but displays no users or data. All data panels are empty. The same page works correctly in local development.

**Cause**

The Supabase browser client is initialized using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. These are `NEXT_PUBLIC_*` variables that must be baked into the client-side bundle at build time. They were present in `.env.production` on the server, but the `Dockerfile` only declared `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_SOCKET_URL` as build arguments. The other four `NEXT_PUBLIC_*` variables were not passed as `--build-arg`, so the browser bundle contained `undefined` for both the Supabase URL and anon key. The Supabase browser client silently initialized with `undefined` values and returned empty arrays for all queries.

**Solution**

Added all six `NEXT_PUBLIC_*` variables as `ARG` and `ENV` declarations in the `Dockerfile`:

```dockerfile
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_GHL_API_BASE_URL
ARG NEXT_PUBLIC_GHL_LOCATION_ID
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_GHL_API_BASE_URL=$NEXT_PUBLIC_GHL_API_BASE_URL
ENV NEXT_PUBLIC_GHL_LOCATION_ID=$NEXT_PUBLIC_GHL_LOCATION_ID
```

Updated `docker-build.sh` to source `.env.production` and pass all six variables as `--build-arg`.

**Prevention**

This is the most critical rule for this Docker setup:

> Every `NEXT_PUBLIC_*` variable used in client-side code MUST be declared as an `ARG`/`ENV` in the `Dockerfile` AND passed as `--build-arg` in the build script. Runtime env vars (`.env.production` via `--env-file`) only reach server-side code. The browser bundle is frozen at build time.

When adding any new `NEXT_PUBLIC_*` variable to the codebase, immediately update `Dockerfile`, `docker-build.sh`, and `docker-build-local.sh`.

---

## Issue 5 — Search Term Persists Across Navigation

**Problem**

After performing a search in the admin portal and then navigating away and back, the search input field shows as empty (no text, no clear button), but the results remain filtered by the previous search term. A hard page refresh is the only way to clear it.

**Cause**

The search term is stored in a Zustand store (`searchTerm`). Zustand state persists across soft Next.js client-side navigation. When `AdminPortalPageContent` remounts, it initializes local input state as empty (`useState("")`), causing the UI to show an empty input. But the Zustand store still holds the previous search term, which continues filtering the data. The two states were out of sync.

**Solution**

Added a `useEffect` cleanup function in `AdminPortalPageContent` that calls `setSearchTerm("")` when the component unmounts. This ensures the Zustand store is reset whenever the user navigates away from the admin portal.

```typescript
useEffect(() => {
  return () => {
    setSearchTerm("");
  };
}, []);
```

**Prevention**

When using Zustand for UI state that should not persist across navigation (search terms, filters, modal state), reset the relevant store values in the component's `useEffect` cleanup.

---

## General Troubleshooting Reference

### Container won't stop

```bash
docker ps                          # find the actual container name/id
docker stop <name_or_id>
docker rm <name_or_id>
```

### Check if the app is running

```bash
docker ps
docker logs -f qr-app
```

### Test Nginx configuration before reloading

```bash
nginx -t
systemctl reload nginx
```

### Manually renew SSL certificate

```bash
certbot renew --dry-run   # test without making changes
certbot renew             # actual renewal
```

### Verify environment variables were baked into the build

Open the browser developer console on the production URL and run:

```javascript
// These should return real values, not undefined
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
```

If `undefined` is returned, the variable was not passed as a build arg during `docker build`.
