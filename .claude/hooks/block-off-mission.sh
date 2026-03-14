#!/usr/bin/env bash
set -euo pipefail

INPUT="$(cat)"

BLOCKED_PATTERNS=(
  "npm run build"
  "npm run export"
  "npx next build"
  "next build"
  "next export"

  "gcloud "
  "gsutil "
  "cloudbuild.yaml"
  "cloud run"
  "artifact registry"
  "secret manager"

  "vercel"
  "netlify"

  "sudo "
  "rm -rf"
  "chmod 777"
  "chown -R"
  "systemctl "
  "service nginx"
  "service apache2"

  "git push"
  "git reset --hard"
  "git clean -fd"

  "docker buildx"
  "Dockerfile.prod"
  "docker-compose.prod"
)

ALLOWED_HINT="Allowed mission: emergency Dockerized next dev restore on existing DigitalOcean box only."

for pattern in "${BLOCKED_PATTERNS[@]}"; do
  if echo "$INPUT" | grep -Fqi "$pattern"; then
    echo "BLOCKED BY CLAUDE HOOK"
    echo "Reason: off-mission or risky action detected -> $pattern"
    echo "$ALLOWED_HINT"
    exit 1
  fi
done

exit 0