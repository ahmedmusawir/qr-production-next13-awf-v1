#!/usr/bin/env bash
set -euo pipefail

CONTAINER_NAME="qr-app"

if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
  echo "🛑 Stopping $CONTAINER_NAME..."
  docker stop "$CONTAINER_NAME"
  docker rm "$CONTAINER_NAME"
  echo "✅ Container stopped and removed."
else
  echo "⚠️  No running container named '$CONTAINER_NAME' found."
fi
