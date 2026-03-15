#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="qr-app"
ENV_FILE=".env.production"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ $ENV_FILE not found. Cannot build without it."
  exit 1
fi

# Load NEXT_PUBLIC_* vars from .env.production so they get baked into the client bundle.
# These are intentionally public (browser-safe) values.
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

# Production URLs — nginx proxies 443 → localhost:4004
NEXT_PUBLIC_API_BASE_URL="https://qrtickets.cyberizewebdevelopment.com"
NEXT_PUBLIC_SOCKET_URL="https://qrtickets.cyberizewebdevelopment.com"

echo "🔨 Building production image: $IMAGE_NAME"
echo "   NEXT_PUBLIC_API_BASE_URL    = $NEXT_PUBLIC_API_BASE_URL"
echo "   NEXT_PUBLIC_SOCKET_URL      = $NEXT_PUBLIC_SOCKET_URL"
echo "   NEXT_PUBLIC_SUPABASE_URL    = $NEXT_PUBLIC_SUPABASE_URL"
echo "   NEXT_PUBLIC_GHL_LOCATION_ID = $NEXT_PUBLIC_GHL_LOCATION_ID"
echo ""

docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL="$NEXT_PUBLIC_API_BASE_URL" \
  --build-arg NEXT_PUBLIC_SOCKET_URL="$NEXT_PUBLIC_SOCKET_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --build-arg NEXT_PUBLIC_GHL_API_BASE_URL="$NEXT_PUBLIC_GHL_API_BASE_URL" \
  --build-arg NEXT_PUBLIC_GHL_LOCATION_ID="$NEXT_PUBLIC_GHL_LOCATION_ID" \
  -t "$IMAGE_NAME" \
  .

echo ""
echo "✅ Build complete: $IMAGE_NAME"
echo ""
echo "To start:  ./server-start.sh"
echo "To stop:   ./server-stop.sh"
