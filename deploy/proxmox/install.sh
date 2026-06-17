#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${DOMAIN:-skl.idnbogor.id}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
SQL_DUMP_FILE="$ROOT_DIR/sklidn.sql"

log() {
  echo "[proxmox-install] $1"
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Command not found: $1"
    exit 1
  fi
}

get_env_value() {
  local file="$1"
  local key="$2"
  local value

  value="$(grep -E "^${key}=" "$file" | tail -n 1 | cut -d'=' -f2- || true)"
  value="${value%$'\r'}"

  if [[ "$value" =~ ^\".*\"$ ]]; then
    value="${value:1:${#value}-2}"
  fi

  echo "$value"
}

replace_or_append_env() {
  local file="$1"
  local key="$2"
  local value="$3"

  if grep -q "^${key}=" "$file"; then
    sed -i "s|^${key}=.*|${key}=${value}|" "$file"
  else
    echo "${key}=${value}" >> "$file"
  fi
}

log "Validating required commands"
require_cmd php
require_cmd composer
require_cmd node
require_cmd npm

log "Preparing backend env"
if [ ! -f "$BACKEND_DIR/.env" ]; then
  cp "$BACKEND_DIR/.env.production.example" "$BACKEND_DIR/.env"
  replace_or_append_env "$BACKEND_DIR/.env" "APP_URL" "https://${DOMAIN}"
  replace_or_append_env "$BACKEND_DIR/.env" "FRONTEND_URL" "https://${DOMAIN}"
  replace_or_append_env "$BACKEND_DIR/.env" "CORS_ALLOWED_ORIGINS" "https://${DOMAIN}"
  replace_or_append_env "$BACKEND_DIR/.env" "SESSION_DOMAIN" "$DOMAIN"
  replace_or_append_env "$BACKEND_DIR/.env" "SANCTUM_STATEFUL_DOMAINS" "${DOMAIN},localhost:5173,127.0.0.1:5173"
else
  log "backend/.env already exists, keeping current file"
fi

log "Preparing frontend production env"
if [ ! -f "$FRONTEND_DIR/.env.production" ]; then
  cp "$FRONTEND_DIR/.env.production.example" "$FRONTEND_DIR/.env.production"
  replace_or_append_env "$FRONTEND_DIR/.env.production" "VITE_API_BASE_URL" "https://${DOMAIN}/api"
  replace_or_append_env "$FRONTEND_DIR/.env.production" "VITE_STORAGE_BASE_URL" "https://${DOMAIN}/storage"
else
  log "frontend/.env.production already exists, keeping current file"
fi

log "Installing backend dependencies"
cd "$BACKEND_DIR"
composer install --no-dev --optimize-autoloader

log "Installing backend node modules and building assets"
npm ci
npm run build

log "Running Laravel optimization"
php artisan key:generate --force

if [ -f "$SQL_DUMP_FILE" ]; then
  log "Importing SQL dump from sklidn.sql"
  require_cmd mysql

  DB_CONNECTION="$(get_env_value "$BACKEND_DIR/.env" "DB_CONNECTION")"
  DB_HOST="$(get_env_value "$BACKEND_DIR/.env" "DB_HOST")"
  DB_PORT="$(get_env_value "$BACKEND_DIR/.env" "DB_PORT")"
  DB_DATABASE="$(get_env_value "$BACKEND_DIR/.env" "DB_DATABASE")"
  DB_USERNAME="$(get_env_value "$BACKEND_DIR/.env" "DB_USERNAME")"
  DB_PASSWORD="$(get_env_value "$BACKEND_DIR/.env" "DB_PASSWORD")"

  DB_CONNECTION="${DB_CONNECTION:-mysql}"
  DB_HOST="${DB_HOST:-127.0.0.1}"
  DB_PORT="${DB_PORT:-3306}"

  if [ "$DB_CONNECTION" != "mysql" ]; then
    echo "DB_CONNECTION must be mysql when using sklidn.sql"
    exit 1
  fi

  if [ -z "$DB_DATABASE" ] || [ -z "$DB_USERNAME" ]; then
    echo "DB_DATABASE and DB_USERNAME must be set in backend/.env"
    exit 1
  fi

  MYSQL_PWD="$DB_PASSWORD" mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -e "CREATE DATABASE IF NOT EXISTS \`$DB_DATABASE\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
  MYSQL_PWD="$DB_PASSWORD" mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" "$DB_DATABASE" < "$SQL_DUMP_FILE"

  migration_table_exists="$(MYSQL_PWD="$DB_PASSWORD" mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -Nse "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='${DB_DATABASE}' AND table_name='migrations';")"
  if [ "$migration_table_exists" = "1" ]; then
    log "Running pending migrations"
    php artisan migrate --force
  else
    log "Skipping artisan migrate because migrations table is not present in imported dump"
  fi
else
  log "sklidn.sql not found, running fresh migrations"
  php artisan migrate --force
fi

php artisan storage:link || true
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

log "Installing frontend dependencies and building"
cd "$FRONTEND_DIR"
npm ci
npm run build

log "Done. Build output:"
log "- Backend public assets in backend/public/build"
log "- Frontend static assets in frontend/dist"
log "Configure Nginx to serve frontend/dist and proxy /api to backend/public/index.php"
