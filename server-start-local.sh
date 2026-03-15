#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="qr-app-local"
CONTAINER_NAME="qr-app-local"

echo "🚀 Starting $CONTAINER_NAME..."

docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p 4004:4004 \
  --env-file .env.local \
  "$IMAGE_NAME"

echo ""
echo "✅ Container started: $CONTAINER_NAME"
echo "   http://localhost:4004"
echo ""
echo "To view logs:  docker logs -f $CONTAINER_NAME"
echo "To stop:       ./server-stop-local.sh"
