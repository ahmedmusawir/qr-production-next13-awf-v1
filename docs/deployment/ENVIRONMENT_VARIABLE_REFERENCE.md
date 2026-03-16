# Environment Variable Reference

This document describes every environment variable required by the QR Ticketing App in production.

## Critical Distinction: Build-Time vs Runtime

This application has two categories of environment variables that behave fundamentally differently in Docker.

### Build-Time Variables (`NEXT_PUBLIC_*`)

Variables prefixed with `NEXT_PUBLIC_` are inlined into the client-side JavaScript bundle by Next.js at build time. Once the bundle is compiled, these values are frozen — changing them in `.env.production` after the build has no effect on the browser.

In Docker, they must be passed as `--build-arg` arguments during `docker build`. The `docker-build.sh` script handles this automatically.

### Runtime Variables (server-side secrets)

Variables without the `NEXT_PUBLIC_` prefix are only accessible in server-side code (API routes, middleware). These are passed to the running container via `--env-file .env.production` at `docker run` time. They are never included in the client bundle.

---

## Build-Time Variables (NEXT_PUBLIC_*)

These six variables must be declared as `ARG` in the `Dockerfile` and passed as `--build-arg` during the Docker build. They are frozen into the client bundle.

---

### `NEXT_PUBLIC_API_BASE_URL`

| Field       | Value                                                                      |
|-------------|----------------------------------------------------------------------------|
| Purpose     | Base URL for all client-side HTTP API requests to the backend              |
| Visibility  | Public — baked into browser bundle                                         |
| Used in     | Client-side fetch calls throughout the frontend                            |
| Build-time  | Yes — must be a `--build-arg`                                              |
| Runtime     | No — changing it in `.env.production` has no effect after build            |

**Production value:** `https://qrtickets.cyberizewebdevelopment.com`

Set explicitly in `docker-build.sh` — this value overrides anything in `.env.production` for this variable.

---

### `NEXT_PUBLIC_SOCKET_URL`

| Field       | Value                                                                      |
|-------------|----------------------------------------------------------------------------|
| Purpose     | URL for the Socket.IO WebSocket connection                                 |
| Visibility  | Public — baked into browser bundle                                         |
| Used in     | Socket.IO client initialization in the frontend                            |
| Build-time  | Yes — must be a `--build-arg`                                              |
| Runtime     | No                                                                         |

**Production value:** `https://qrtickets.cyberizewebdevelopment.com`

Shares the same domain as `NEXT_PUBLIC_API_BASE_URL` because Socket.IO runs on the same Express server on port 4004.

---

### `NEXT_PUBLIC_SUPABASE_URL`

| Field       | Value                                                                      |
|-------------|----------------------------------------------------------------------------|
| Purpose     | Supabase project URL — used to initialize the Supabase browser client     |
| Visibility  | Public — safe to expose (Supabase requires it client-side)                 |
| Used in     | `utils/supabase/middleware.ts`, Supabase client initialization             |
| Build-time  | Yes — must be a `--build-arg`                                              |
| Runtime     | No                                                                         |

Sourced from `.env.production` by `docker-build.sh`. Not overridden — use the Supabase project URL from your Supabase dashboard.

---

### `NEXT_PUBLIC_SUPABASE_ANON_KEY`

| Field       | Value                                                                      |
|-------------|----------------------------------------------------------------------------|
| Purpose     | Supabase anonymous (public) API key — used by the browser client          |
| Visibility  | Public — safe to expose (Supabase anonymous key has row-level security)    |
| Used in     | Supabase browser client initialization, `utils/supabase/middleware.ts`     |
| Build-time  | Yes — must be a `--build-arg`                                              |
| Runtime     | No                                                                         |

Sourced from `.env.production` by `docker-build.sh`. Not overridden.

---

### `NEXT_PUBLIC_GHL_API_BASE_URL`

| Field       | Value                                                                      |
|-------------|----------------------------------------------------------------------------|
| Purpose     | Base URL for GoHighLevel (GHL) API calls made from the browser             |
| Visibility  | Public — baked into browser bundle                                         |
| Used in     | Client-side GHL data fetching                                              |
| Build-time  | Yes — must be a `--build-arg`                                              |
| Runtime     | No                                                                         |

Sourced from `.env.production` by `docker-build.sh`. Not overridden.

---

### `NEXT_PUBLIC_GHL_LOCATION_ID`

| Field       | Value                                                                      |
|-------------|----------------------------------------------------------------------------|
| Purpose     | GoHighLevel location identifier used to scope API requests                 |
| Visibility  | Public — baked into browser bundle                                         |
| Used in     | Client-side GHL queries to identify the correct account/location           |
| Build-time  | Yes — must be a `--build-arg`                                              |
| Runtime     | No                                                                         |

Sourced from `.env.production` by `docker-build.sh`. Not overridden.

---

## Runtime Variables (Server-Side Only)

These variables are loaded at container startup via `--env-file .env.production`. They are only accessible in server-side code: API routes, middleware, and server components.

---

### `SUPABASE_SERVICE_ROLE_KEY`

| Field       | Value                                                                      |
|-------------|----------------------------------------------------------------------------|
| Purpose     | Supabase service role key — grants admin-level database access             |
| Visibility  | Server-only — must never be exposed to the browser                         |
| Used in     | `app/api/admin/route.ts` and other server-side Supabase admin operations   |
| Build-time  | No — must NOT be a `--build-arg`                                           |
| Runtime     | Yes — loaded via `--env-file .env.production` at `docker run` time         |

> **Security note:** This key bypasses row-level security in Supabase. It must never appear in client-side code or be passed as a Docker build argument. Treat it like a database root password.

---

## Environment File Layout

### `.env.production` (server — not committed to version control)

Contains all variables. Used in two ways:

1. **At build time:** `docker-build.sh` sources this file to extract `NEXT_PUBLIC_*` values and pass them as `--build-arg`.
2. **At runtime:** `server-start.sh` passes this file to the container via `--env-file`.

### `.env.local` (local development — not committed to version control)

Contains the same variables with local/development values. Used by:

1. `npm run dev` — standard Next.js local development
2. `docker-build-local.sh` + `server-start-local.sh` — local Docker testing

---

## Adding a New `NEXT_PUBLIC_*` Variable

If a new client-side environment variable is introduced, it must be added in three places:

1. **`Dockerfile`** — declare as `ARG` and assign to `ENV`
2. **`docker-build.sh`** — pass as `--build-arg`
3. **`docker-build-local.sh`** — pass as `--build-arg` for local Docker testing

Failure to add it to the Dockerfile means the variable will be `undefined` in the browser bundle even if it is present in `.env.production`.
