# Lessons Learned — QR Ticketing App Production Deployment

Insights captured from the first production deployment. These inform how future deployments of this application and similar projects should be approached.

---

## 1. The NEXT_PUBLIC_* Build-Time Rule Is Non-Negotiable

**What happened:** The admin portal loaded successfully but showed no data. After investigation, the root cause was that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` were `undefined` in the browser bundle because they were not declared as Docker build arguments. The Supabase browser client silently failed, returning empty arrays for every query.

**Why it's subtle:** These variables appeared to work locally because Next.js picks them up from `.env.local` during local `next build`. Inside Docker, there is no `.env` file loaded at build time — only `--build-arg` values exist. The behavior diverges in a way that produces no loud error, only silent empty data.

**The rule:** Every `NEXT_PUBLIC_*` variable must be:
1. Declared as `ARG` and `ENV` in the `Dockerfile`
2. Passed as `--build-arg` in `docker-build.sh`
3. Passed as `--build-arg` in `docker-build-local.sh`

This must be enforced as a checklist item any time a new `NEXT_PUBLIC_*` variable is introduced.

---

## 2. Middleware Redirects Must Account for Missing Pages

**What happened:** On a fresh server with no authenticated session, the app returned `ERR_TOO_MANY_REDIRECTS`. The middleware was redirecting unauthenticated users to `/login`, but `/login` does not exist in this application. The redirect looped indefinitely.

**Why it worked locally:** The developer's machine had an active Supabase session cookie, so the redirect never triggered.

**The lesson:** Before deploying, validate what happens when a user with no session hits every route that the middleware protects. If the redirect target doesn't exist, the loop is inevitable. Auth logic in middleware should be minimal — redirect only if you are certain the target exists and is reachable. In this project, auth protection belongs at the page level, not in global middleware.

---

## 3. Docker Builds Expose Static Rendering Assumptions

**What happened:** `docker build` failed during `next build` with an exit code 1 error on `app/api/admin/route.ts`. The route was accessing `SUPABASE_SERVICE_ROLE_KEY`, which is a runtime-only variable. Next.js tried to statically render the route during the build, found `undefined`, and crashed.

**Why it worked locally:** `.env.local` is automatically loaded by Next.js during local `next build`, making all variables available. This masked the problem.

**The lesson:** Next.js's static rendering behavior during build is aggressive and not always obvious. Any API route or page that touches runtime-only environment variables needs `export const dynamic = "force-dynamic"`. Treat the Docker build as your integration test for these assumptions. If it fails inside Docker, it's surfacing a real environment assumption that was previously hidden by the local `.env` loading.

**Corollary:** Perform a Docker build locally (`./docker-build-local.sh`) before pushing code to the server. Catching build failures locally is far faster than debugging them on the droplet.

---

## 4. Layout Files Must Not Make Network Calls at Static Render Time

**What happened:** After fixing the API route issue, the build became extremely slow — over 10 seconds per page. The root cause was `app/layout.tsx` calling external network services (`fetchAndGenerateTicketTypes()`, `fetchAndGenerateValidOrderList()`) that were unreachable inside the Docker build environment. Each call timed out, and the layout wraps every page, multiplying the timeout.

**The lesson:** Layout files are rendered for every page during static generation. Network calls in layouts become the worst-case bottleneck in a Docker build. Move data fetching out of layouts and into individual pages or server component children. When data must be fetched in a layout, ensure `export const dynamic = "force-dynamic"` is set to defer rendering to request time.

---

## 5. Local Docker Testing Before Server Deployment

**What was built:** Dedicated local build and run scripts (`docker-build-local.sh`, `server-start-local.sh`, `server-stop-local.sh`) that mirror the production scripts exactly but target `localhost:4004` and source `.env.local`.

**Why it matters:** Running the full Docker build locally catches environment variable, build, and runtime issues before they reach the server. The local Docker environment is the most accurate simulation of the production Docker environment available before deployment. Issues 1, 2, and 4 above would have been caught locally if local Docker testing had been done first.

**Best practice:** The local Docker test cycle (`./docker-build-local.sh` → `./server-start-local.sh` → manual verification → `./server-stop-local.sh`) should be a required pre-deployment gate.

---

## 6. Separate Image Names for Local vs Production

**Decision:** Local Docker images are named `qr-app-local` and production images are named `qr-app`. Containers follow the same naming.

**Why it matters:** Without separate names, running a local test build would overwrite the production image tag locally, creating confusion about which image is which. Using distinct names allows both to coexist and makes it visually obvious in `docker ps` and `docker images` which environment each artifact belongs to.

---

## 7. Zustand State Does Not Reset on Navigation

**What happened:** The admin portal search term persisted after navigating away and back. The input displayed as empty, but the store still held the previous search term, keeping the results filtered.

**The lesson:** Zustand state is module-level and survives React component unmounting. Any Zustand slice that represents transient UI state (search terms, filters, modal open/close state) must be explicitly reset when the component that owns it unmounts. Do not assume that component lifecycle cleans up external state stores.

---

## 8. The Deployment Runbook Is Worth Writing Before You Need It

**What was built:** `doc/deploy.md` (now expanded into `/docs/deployment/`) — a minimal runbook covering the 6 re-deploy commands, script reference, nginx config location, and SSL renewal.

**Why it matters:** Re-deploy is a 6-command sequence. Without documentation, any team member (or future agent) who performs a re-deploy must reconstruct the sequence from memory or from the session log. The runbook costs 10 minutes to write and saves that time on every future deploy.

---

## 9. Nginx WebSocket Headers Are Required for Socket.IO

**Decision:** The Nginx configuration includes `proxy_set_header Upgrade $http_upgrade` and `proxy_set_header Connection 'upgrade'`.

**Why it matters:** Socket.IO starts as an HTTP connection that upgrades to WebSocket. Without these headers, Nginx strips the upgrade request and Socket.IO falls back to long-polling, which degrades real-time performance significantly or fails entirely depending on configuration.

---

## Summary of Best Practices for Future Deployments

| Practice | Reason |
|----------|--------|
| Always test Docker build locally before pushing to server | Catches build failures in 2 minutes instead of after an SSH session |
| Declare every `NEXT_PUBLIC_*` var in Dockerfile and build scripts | Silent `undefined` in browser is the hardest type of bug to diagnose |
| Add `force-dynamic` to any route accessing runtime-only env vars | Prevents build-time static render failures |
| Avoid network calls in layout files | Multiplies build time; causes timeouts in isolated build environments |
| Reset Zustand UI state on component unmount | Prevents stale filter/search state persisting across navigation |
| Keep middleware to session refresh only | Redirect logic in middleware requires careful accounting for edge cases |
| Write the re-deploy runbook during deployment, not after | Context is richest during the session; document while it's live |
