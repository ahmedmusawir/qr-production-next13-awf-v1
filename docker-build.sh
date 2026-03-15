#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="qr-app"

# Stage 1 URL (before nginx + SSL).
# When SSL is set up, update these to https://qrtickets.cyberizewebdevelopment.com
# and rebuild the image.
NEXT_PUBLIC_API_BASE_URL="http://cyberizewebdevelopment.com:4004"
NEXT_PUBLIC_SOCKET_URL="http://cyberizewebdevelopment.com:4004"

echo "🔨 Building production image: $IMAGE_NAME"
echo "   NEXT_PUBLIC_API_BASE_URL = $NEXT_PUBLIC_API_BASE_URL"
echo "   NEXT_PUBLIC_SOCKET_URL   = $NEXT_PUBLIC_SOCKET_URL"
echo ""

docker build \
  --build-arg NEXT_PUBLIC_API_BASE_URL="$NEXT_PUBLIC_API_BASE_URL" \
  --build-arg NEXT_PUBLIC_SOCKET_URL="$NEXT_PUBLIC_SOCKET_URL" \
  -t "$IMAGE_NAME" \
  .

echo ""
echo "✅ Build complete: $IMAGE_NAME"
echo ""
echo "To run locally:"
echo "  docker run --rm -p 4004:4004 --env-file .env.production $IMAGE_NAME"
echo ""
echo "To run on the DO droplet:"
echo "  docker run -d --restart unless-stopped -p 4004:4004 --env-file .env.production $IMAGE_NAME"
