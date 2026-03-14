---
name: emergency-nextjs-restore
description: Use this skill when restoring an older Next.js application quickly on an existing Docker-enabled server, especially when production build issues are intentionally being deferred and the immediate goal is a controlled Dockerized dev-mode recovery.
---

# Emergency Next.js Restore

## Mission

You are assisting with an emergency restore of an older Next.js application.

The goal is to get the application running inside Docker on an existing Docker-enabled DigitalOcean fallback server as quickly and safely as possible.

This is a recovery mission, not a modernization project.

## Non-Negotiable Context

- The app currently works locally outside Docker.
- There is a known build-mode issue.
- We are NOT fixing the build issue in this mission.
- We are intentionally avoiding Google Cloud for this job.
- We are intentionally choosing the shortest path to restore service.
- The target server already has Docker and already proves domain/SSL capability through existing workloads.
- The app may involve GHL CRM, Supabase, websockets, and older Next.js patterns.
- The deployment mode for this mission is Dockerized `next dev`, unless the human explicitly changes the mission.

## Hard Rules

1. Do NOT try to solve the existing production build problem.
2. Do NOT pivot this mission into production-mode deployment.
3. Do NOT introduce Google Cloud services, files, or deployment guidance unless explicitly requested.
4. Do NOT refactor unrelated code.
5. Do NOT clean up the repo unless it is required to make Dockerization work.
6. Do NOT hardcode secrets.
7. Do NOT guess environment variables if they can be discovered from the repo.
8. Do NOT make large structural changes without approval.
9. Keep all changes minimal, surgical, and reversible.
10. Prefer boring, obvious solutions over clever ones.

## Primary Outcome

Create the minimum viable Docker setup required to:

- run the app in `next dev`
- work with existing environment variables
- be tested locally first
- be easy to move onto the existing DigitalOcean Docker server

## Required Workflow

### Phase 1 — Discovery First

Before making any edits, do the following:

A. State your assumptions clearly.

Use this format:

ASSUMPTIONS:

1. ...
2. ...
3. ...

B. Provide a short plan.

Use this format:

PLAN:

1. ...
2. ...
3. ...

C. List the exact files you want to inspect first.

Start with:

- `package.json`
- lockfile (`package-lock.json`, `yarn.lock`, or `pnpm-lock.yaml`)
- `next.config.js` / `next.config.mjs` / `next.config.ts`
- `.env.example` and any env docs
- custom server files like `server.js`, `index.js`, `app.js`
- websocket-related files
- middleware/proxy files
- repo root tree

Do not edit anything before this discovery pass is approved.

### Phase 2 — Inspection Output

After inspection, report:

1. What kind of Next.js app this is
2. Which package manager it uses
3. Which scripts are used for dev/start/build
4. Which env vars appear required
5. Whether websockets/custom server behavior affects Dockerization
6. The minimum file changes you propose

### Phase 3 — Minimal Dockerization

Only after approval, create only the minimum needed:

- `Dockerfile`
- `.dockerignore`
- `docker-compose.yml` only if it truly helps
- a tiny helper script only if absolutely necessary

### Phase 4 — Local Test Instructions

After changes, provide exact commands for:

- local Docker build
- local Docker run
- local verification
- later deployment on the DigitalOcean box

## Security Guardrails For This Recovery

Because this is a recovery mission after a previous compromise history, apply these guardrails where possible without derailing speed:

- Prefer non-root container execution if feasible without major surgery
- Keep exposed ports simple and explicit
- Assume secrets come from env files or deployment env vars, never source code
- Avoid unnecessary package changes
- Avoid unnecessary dependency upgrades unless required by the human

## Output Format

After any approved change, always return:

CHANGES MADE:

- file path — what changed and why

THINGS NOT TOUCHED:

- file path — intentionally left alone

COMMANDS TO RUN LOCALLY:

- exact commands

COMMANDS TO RUN LATER ON SERVER:

- exact commands

RISKS / VERIFY NEXT:

- concise list

## Anti-Patterns

Do not:

- chase the production build issue
- migrate the app
- rewrite app structure
- swap frameworks
- reorganize folders
- add cloud deployment files
- silently change package manager
- silently change runtime architecture

## Success Definition

This mission is successful when:

- the repo has a minimal Docker setup
- the app runs in Docker with `next dev`
- the user can test it locally
- the path to deploy on the existing Docker box is clear
