#!/usr/bin/env bash
set -euo pipefail

REMOTE_DIR="${REMOTE_DIR:-/opt/yumeiho-wellness}"
REMOTE_ARCHIVE="${REMOTE_ARCHIVE:-/tmp/yumeiho-deploy-manual.tar.gz}"
REMOTE_ENV="${REMOTE_ENV:-/tmp/yumeiho-env-manual}"
SKIP_BUILD="${SKIP_BUILD:-0}"
INSTALL_DOCKER="${INSTALL_DOCKER:-0}"

if [ "$INSTALL_DOCKER" = "1" ] && ! command -v docker >/dev/null 2>&1; then
  if command -v sudo >/dev/null 2>&1; then
    curl -fsSL https://get.docker.com | sudo sh
  else
    curl -fsSL https://get.docker.com | sh
  fi
fi

if docker info >/dev/null 2>&1; then
  DC="docker compose"
elif sudo -n docker info >/dev/null 2>&1; then
  DC="sudo docker compose"
else
  echo "Docker daemon is not reachable for current user. Add user to docker group or use sudo."
  exit 1
fi

mkdir -p "$REMOTE_DIR"

if [ -f "$REMOTE_DIR/docker-compose.pi.yml" ]; then
  $DC -f "$REMOTE_DIR/docker-compose.pi.yml" down --remove-orphans || true
fi

find "$REMOTE_DIR" -mindepth 1 -maxdepth 1 ! -name 'data' -exec rm -rf {} +
tar -xzf "$REMOTE_ARCHIVE" -C "$REMOTE_DIR"
mv "$REMOTE_ENV" "$REMOTE_DIR/.env.pi"
rm -f "$REMOTE_ARCHIVE"

cd "$REMOTE_DIR"
if [ "$SKIP_BUILD" = "1" ]; then
  $DC -f docker-compose.pi.yml --env-file .env.pi up -d --remove-orphans
else
  $DC -f docker-compose.pi.yml --env-file .env.pi up -d --build --remove-orphans
fi
$DC -f docker-compose.pi.yml --env-file .env.pi ps
