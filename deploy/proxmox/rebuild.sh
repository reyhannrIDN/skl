#!/usr/bin/env bash
# ============================================================
# SKLIDN - Rebuild & Redeploy Script
# Jalankan setelah mengubah .env, kode, atau konfigurasi:
#   sudo bash deploy/proxmox/rebuild.sh
#   sudo SKIP_FRONTEND=1 bash deploy/proxmox/rebuild.sh  (hanya backend)
#   sudo SKIP_BACKEND=1  bash deploy/proxmox/rebuild.sh  (hanya frontend)
# ============================================================
set -euo pipefail

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

log()     { echo -e "${GREEN}[✔]${NC} $*"; }
info()    { echo -e "${CYAN}[i]${NC} $*"; }
warn()    { echo -e "${YELLOW}[!]${NC} $*"; }
section() { echo -e "\n${BOLD}${CYAN}═══ $* ═══${NC}"; }

[[ "$EUID" -ne 0 ]] && exec sudo bash "$0" "$@"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="${APP_DIR:-/var/www/SKLIDN}"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
PHP_VER=$(php -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;" 2>/dev/null || echo "8.2")
APP_USER="www-data"
SKIP_FRONTEND="${SKIP_FRONTEND:-0}"
SKIP_BACKEND="${SKIP_BACKEND:-0}"

echo -e "\n${BOLD}${CYAN}═══ SKLIDN Rebuild — $(date '+%Y-%m-%d %H:%M:%S') ═══${NC}\n"

# ── Backend rebuild ──────────────────────────────────────────
if [[ "$SKIP_BACKEND" != "1" ]]; then
  section "Backend (Laravel)"

  if [[ ! -f "$BACKEND_DIR/.env" ]]; then
    warn ".env tidak ditemukan di $BACKEND_DIR — jalankan setup-autostart.sh terlebih dahulu"
    exit 1
  fi

  cd "$BACKEND_DIR"

  info "Menginstal/memperbarui Composer dependencies..."
  composer install --no-dev --optimize-autoloader --no-interaction

  info "Membersihkan cache lama..."
  php artisan config:clear
  php artisan route:clear
  php artisan view:clear
  php artisan cache:clear

  # Baca credential DB dari .env
  DB_NAME=$(grep -E '^DB_DATABASE=' "$BACKEND_DIR/.env" | cut -d= -f2- | tr -d '\r')
  DB_USER=$(grep -E '^DB_USERNAME=' "$BACKEND_DIR/.env" | cut -d= -f2- | tr -d '\r')
  DB_PASS=$(grep -E '^DB_PASSWORD=' "$BACKEND_DIR/.env" | cut -d= -f2- | tr -d '\r')
  DB_HOST=$(grep -E '^DB_HOST='     "$BACKEND_DIR/.env" | cut -d= -f2- | tr -d '\r')
  DB_HOST="${DB_HOST:-127.0.0.1}"

  SQL_DUMP="$APP_DIR/sklidn.sql"
  if [[ -f "$SQL_DUMP" ]]; then
    info "Menghapus & membuat ulang database '$DB_NAME'..."
    MYSQL_PWD="$DB_PASS" mysql -h"$DB_HOST" -u"$DB_USER" 2>/dev/null <<SQL || \
    mysql -u root 2>/dev/null <<SQL
DROP DATABASE IF EXISTS \`${DB_NAME}\`;
CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL
    info "Mengimpor sklidn.sql..."
    MYSQL_PWD="$DB_PASS" mysql -h"$DB_HOST" -u"$DB_USER" "$DB_NAME" < "$SQL_DUMP"
    log "Database di-reset dan sklidn.sql berhasil diimpor"
    info "Menjalankan migrasi untuk tabel yang belum ada..."
    php artisan migrate --force
  else
    warn "sklidn.sql tidak ditemukan di $APP_DIR — hanya jalankan migrasi"
    php artisan migrate --force
  fi

  info "Membangun ulang cache produksi..."
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache

  php artisan storage:link 2>/dev/null || true

  chown -R "$APP_USER:$APP_USER" "$BACKEND_DIR/storage" "$BACKEND_DIR/bootstrap/cache"
  log "Backend siap"
fi

# ── Frontend rebuild ─────────────────────────────────────────
if [[ "$SKIP_FRONTEND" != "1" ]]; then
  section "Frontend (Vite/React)"

  if [[ ! -f "$FRONTEND_DIR/.env.production" ]]; then
    warn ".env.production tidak ditemukan di $FRONTEND_DIR"
    warn "Pastikan VITE_API_BASE_URL sudah diset, atau frontend akan fallback ke port 8000!"

    # Coba buat dari APP_URL backend .env
    if [[ -f "$BACKEND_DIR/.env" ]]; then
      APP_URL=$(grep -E '^APP_URL=' "$BACKEND_DIR/.env" | cut -d= -f2-)
      if [[ -n "$APP_URL" ]]; then
        info "Membuat .env.production dari APP_URL backend: $APP_URL"
        cat > "$FRONTEND_DIR/.env.production" <<ENVFILE
VITE_API_BASE_URL=${APP_URL}/api
VITE_STORAGE_BASE_URL=${APP_URL}/storage
VITE_GOOGLE_API_KEY=
VITE_GOOGLE_CLIENT_ID=
ENVFILE
        log ".env.production dibuat: VITE_API_BASE_URL=${APP_URL}/api"
      fi
    fi
  fi

  # Tampilkan URL yang akan digunakan agar mudah diverifikasi
  VITE_API=$(grep -E '^VITE_API_BASE_URL=' "$FRONTEND_DIR/.env.production" 2>/dev/null | cut -d= -f2- || echo "(tidak ada)")
  info "VITE_API_BASE_URL = $VITE_API"

  cd "$FRONTEND_DIR"

  info "Menginstal/memperbarui npm packages..."
  npm ci

  info "Build frontend..."
  npm run build

  log "Frontend build selesai → $FRONTEND_DIR/dist"
fi

# ── Reload nginx & queue ─────────────────────────────────────
section "Reload Services"

nginx -t && systemctl reload nginx && log "Nginx reloaded" || warn "Nginx config error — cek dengan: nginx -t"
systemctl restart "sklidn-queue" && log "Queue worker restarted" || warn "sklidn-queue gagal restart"

# ── Tampilkan URL ────────────────────────────────────────────
SERVER_IP=$(hostname -I | awk '{print $1}')
HTTP_PORT=$(grep -E '^\s*listen\s+[0-9]+' /etc/nginx/sites-enabled/sklidn 2>/dev/null \
  | head -1 | grep -oP '\d+' | tail -1 || echo "80")
DOMAIN_CFG=$(grep -E '^\s*server_name\s+' /etc/nginx/sites-enabled/sklidn 2>/dev/null \
  | awk '{print $2}' | tr -d ';' || echo "")
[[ "$DOMAIN_CFG" == "$SERVER_IP" ]] && DOMAIN_CFG=""

echo ""
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${GREEN}║          SKLIDN - Rebuild Selesai                ║${NC}"
echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  Frontend  →  ${CYAN}http://${SERVER_IP}:${HTTP_PORT}${NC}"
echo -e "  API       →  ${CYAN}http://${SERVER_IP}:${HTTP_PORT}/api${NC}"
if [[ -n "$DOMAIN_CFG" ]]; then
echo -e "  Domain    →  ${CYAN}https://${DOMAIN_CFG}${NC}"
fi
echo ""
echo -e "${BOLD}${GREEN}══════════════════════════════════════════════════${NC}"
echo ""
