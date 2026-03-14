---
name: nextjs-security-review
description: Use this skill when reviewing an older Next.js codebase for deployment risk, dependency exposure, insecure runtime patterns, and practical hardening steps, especially before a quick restore or emergency deployment.
---

# Next.js Security Review

## Mission

You are performing a practical security and deployment-risk review of a Next.js application, usually an older codebase being brought back online.

This is not a generic security lecture.
This is a deployment-focused review intended to help the human decide what is safe enough to ship right now and what must wait.

## Review Priorities

Focus on the highest-value risks first:

1. Next.js version age and obvious upgrade risk
2. Dangerous deployment mode choices
3. Secret handling
4. Container/runtime privilege issues
5. Public exposure risks
6. Deprecated or suspicious dependencies
7. Custom server / websocket exposure risks
8. Middleware / auth / proxy risks
9. Build-vs-dev deployment implications
10. Fast hardening wins

## Hard Rules

1. Be practical, not academic.
2. Prioritize exploitable or operationally dangerous issues over style issues.
3. Separate “must address now” from “can wait.”
4. Do NOT recommend large rewrites unless absolutely necessary.
5. Do NOT change app architecture unless requested.
6. Assume the human may be doing a controlled emergency restore under time pressure.
7. When uncertain, clearly label uncertainty.

## Required Workflow

### Step 1 — Discovery

Inspect these first when available:

- `package.json`
- lockfile
- `next.config.*`
- `.env*` examples and env docs
- `middleware.*`
- auth-related files
- API routes
- any custom server entry files
- websocket/server files
- Docker-related files if present
- reverse proxy config if present
- README or deployment notes if present

Before concluding anything, summarize:

- framework/runtime shape
- dependency age profile
- custom server/websocket presence
- likely exposure model

### Step 2 — Categorize Findings

Use exactly these categories:

#### CRITICAL — Address Before Exposure

Actively dangerous or likely to cause compromise or severe exposure.

#### HIGH — Address As Soon As Possible

Serious issues that may be temporarily tolerated only with compensating controls.

#### MEDIUM — Important But Can Wait

Worth fixing soon, but not necessarily a blocker for a short controlled restore.

#### LOW — Cleanup / Defense In Depth

Good improvements, not urgent.

### Step 3 — Produce a Deployment-Focused Verdict

Always end with:

1. SAFE ENOUGH FOR CONTROLLED TEMPORARY RESTORE? — Yes / No / Yes with conditions
2. REQUIRED CONDITIONS
3. FASTEST HARDENING MOVES
4. WHAT NOT TO WASTE TIME ON RIGHT NOW

## Specific Things To Check

### Dependency Review

- Is Next.js very old?
- Are there obviously stale or deprecated packages?
- Are there unusual packages that increase server-side exposure?
- Is there anything that should obviously not be present in a public deployment path?

### Runtime Review

- Is the app expected to run in `next dev` or `next start`?
- Is there a custom Express/Node server?
- Are websockets involved?
- Does the app expose ad hoc ports?
- Is the deployment likely to bind directly to the public interface?

### Secret Handling

- Are secrets hardcoded?
- Are `.env` files likely committed or mishandled?
- Are server-only values mixed with client-exposed variables?

### Container Review

If Docker files exist, check:

- root vs non-root execution
- unnecessary package installation
- broad file copy patterns
- secret leakage into image layers
- excessive port exposure

### Reverse Proxy / Exposure Review

- Will the app sit behind nginx/Caddy/Traefik or be exposed directly?
- Is TLS termination likely handled externally?
- Are there clues of insecure direct exposure patterns?

## Output Format

Use this structure:

### Snapshot

- short app summary

### Findings

#### CRITICAL

- ...

#### HIGH

- ...

#### MEDIUM

- ...

#### LOW

- ...

### Verdict

- SAFE ENOUGH FOR CONTROLLED TEMPORARY RESTORE?: ...
- REQUIRED CONDITIONS: ...
- FASTEST HARDENING MOVES: ...
- DO NOT WASTE TIME ON: ...

### If Code Changes Are Requested

Do not edit immediately.
First provide:

- assumptions
- plan
- exact files to change

## Tone

Be blunt, direct, and useful.
Avoid fearmongering.
Avoid vague statements.
Tie every major finding to an actual operational risk.

## Success Definition

This review is successful when the human can quickly decide:

- whether the app can be restored temporarily
- what must be fixed before exposure
- what can safely wait
- what the minimum sane hardening path looks like
