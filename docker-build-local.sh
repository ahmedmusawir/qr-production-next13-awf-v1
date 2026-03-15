#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="qr-app-local"

NEXT_PUBLIC_API_BASE_URL="http://localhost:4004"
NEXT_PUBLIC_SOCKET_URL="http://localhost:4004"

echo "🔨 Building local image: $IMAGE_NAME"
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
echo "To start:  ./server-start-local.sh"
echo "To stop:   ./server-stop-local.sh"
