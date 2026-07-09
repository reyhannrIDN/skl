#!/usr/bin/env bash
# ============================================================
# SKLIDN - Proxmox Auto Installer All-in-One
#
# Cara pakai di Proxmox (LXC/VM Debian/Ubuntu):
#
#   1. Upload folder SKLIDN ke server, lalu:
#      sudo bash /path/ke/SKLIDN/deploy/proxmox/proxmox.sh
#
#   2. Atau dari repo Git:
#      git clone https://github.com/username/SKLIDN.git
#      cd SKLIDN
#      sudo bash deploy/proxmox/proxmox.sh
#
#   3. Atau langsung dari URL (jika repo public):
#      bash <(curl -sL https://raw.githubusercontent.com/username/SKLIDN/main/deploy/proxmox/proxmox.sh)
#
# Variabel env (opsional):
#   DOMAIN=skl.idnbogor.id   # Pakai domain (otomatis HTTPS via certbot)
#   PORT=8080                # Ganti port HTTP (default: 80)
#   DB_PASS=secret           # Password MySQL (default: auto-generate)
#
# Semua service auto-start ketika server reboot.
# ============================================================
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

log()  { echo -e "${GREEN}[✔]${NC} $*"; }
info() { echo -e "${BLUE}[i]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
err()  { echo -e "${RED}[✘]${NC} $*" >&2; exit 1; }
section() { echo -e "\n${BOLD}${CYAN}══════════════════════════════════════════════${NC}"; echo -e "${BOLD}${CYAN} $* ${NC}"; echo -e "${BOLD}${CYAN}══════════════════════════════════════════════${NC}"; }

[[ "$EUID" -ne 0 ]] && err "Jalankan sebagai root:\n   sudo bash $0"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd 2>/dev/null || echo "$SCRIPT_DIR")"

PHP_VER="8.2"
HTTP_PORT="${PORT:-80}"
DOMAIN="${DOMAIN:-}"
DB_NAME="${DB_NAME:-sklidn}"
DB_USER="${DB_USER:-sklidn_user}"
DB_PASS="${DB_PASS:-}"
QUEUE_SERVICE="sklidn-queue"
APP_USER="www-data"
APP_DIR="/var/www/SKLIDN"

detect_ip() {
  local ip
  ip=$(hostname -I 2>/dev/null | awk '{print $1}')
  [[ -z "$ip" ]] && ip=$(ip route get 1.1.1.1 2>/dev/null | awk '{print $7; exit}')
  [[ -z "$ip" ]] && ip="127.0.0.1"
  echo "$ip"
}
SERVER_IP=$(detect_ip)
APP_HOST="${DOMAIN:-$SERVER_IP}"
APP_URL="http://$APP_HOST:$HTTP_PORT"
[[ -n "$DOMAIN" ]] && APP_URL="https://$DOMAIN"

section "SKLIDN Proxmox Auto Installer"
echo -e "${BOLD}Tanggal${NC}    : $(date '+%Y-%m-%d %H:%M:%S')"
echo -e "${BOLD}Server IP${NC}  : $SERVER_IP"
echo -e "${BOLD}Port${NC}       : $HTTP_PORT"
echo -e "${BOLD}Domain${NC}     : ${DOMAIN:-(tanpa domain)}"
echo -e "${BOLD}PHP${NC}        : $PHP_VER"
echo ""

# ── PRE-FLIGHT: Cek apakah source ada di tempat ──────────────
if [[ ! -f "$ROOT_DIR/backend/composer.json" ]]; then
  warn "Source project tidak ditemukan di $ROOT_DIR"
  info "Mencoba clone dari repository..."
  
  # Cek apakah ada repo remote
  if git -C "$ROOT_DIR" remote get-url origin &>/dev/null; then
    REPO_URL=$(git -C "$ROOT_DIR" remote get-url origin)
    cd /tmp
    git clone --depth=1 "$REPO_URL" /tmp/SKLIDN-clone 2>/dev/null || err "Gagal clone repository"
    ROOT_DIR="/tmp/SKLIDN-clone"
    SCRIPT_DIR="$ROOT_DIR/deploy/proxmox"
    APP_DIR="/var/www/SKLIDN"
    info "Menggunakan source dari $REPO_URL"
  else
    err "Folder project tidak valid. Pastikan script dijalankan dari dalam folder SKLIDN:\n  cd /path/ke/SKLIDN\n  sudo bash deploy/proxmox/proxmox.sh"
  fi
fi

BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

# ================================================================
# 1. INSTALL DEPENDENSI SISTEM
# ================================================================
section "1. Install Dependency Sistem"

# Hapus Apache dulu (sering konflik dengan Nginx di Proxmox LXC)
if systemctl is-active --quiet apache2 2>/dev/null; then
  warn "Apache2 berjalan → menghentikan..."
  systemctl stop apache2; systemctl disable apache2
fi
if command -v apache2 >/dev/null 2>&1; then
  DEBIAN_FRONTEND=noninteractive apt-get remove -y --purge apache2 apache2-bin apache2-data apache2-utils libapache2-mod-php* 2>/dev/null || true
  apt-get autoremove -y 2>/dev/null || true
  log "Apache2 dihapus"
fi

apt-get update -qq
DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends software-properties-common curl gnupg ca-certificates lsb-release unzip git openssl rsync

# PHP 8.2 + FPM
if ! php -v 2>/dev/null | grep -q "PHP $PHP_VER"; then
  info "Install PHP $PHP_VER (via PPA ondrej)..."
  add-apt-repository -y ppa:ondrej/php 2>/dev/null || {
    curl -sSL https://packages.sury.org/php/apt.gpg | gpg --dearmor -o /usr/share/keyrings/sury-php.gpg
    echo "deb [signed-by=/usr/share/keyrings/sury-php.gpg] https://packages.sury.org/php/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/sury-php.list
    apt-get update -qq
  }
  DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    php${PHP_VER} php${PHP_VER}-fpm php${PHP_VER}-cli php${PHP_VER}-mysql \
    php${PHP_VER}-xml php${PHP_VER}-mbstring php${PHP_VER}-curl php${PHP_VER}-zip \
    php${PHP_VER}-bcmath php${PHP_VER}-tokenizer php${PHP_VER}-fileinfo php${PHP_VER}-intl php${PHP_VER}-gd
else
  log "PHP $PHP_VER sudah terinstal"
  apt-get remove -y --purge libapache2-mod-php${PHP_VER} libapache2-mod-php 2>/dev/null || true
fi

# Nginx
command -v nginx >/dev/null 2>&1 || apt-get install -y --no-install-recommends nginx
log "Nginx OK"

# MySQL
command -v mysql >/dev/null 2>&1 || apt-get install -y --no-install-recommends mysql-server
log "MySQL OK"

# Redis
command -v redis-cli >/dev/null 2>&1 || apt-get install -y --no-install-recommends redis-server || true
log "Redis OK"

# Composer
command -v composer >/dev/null 2>&1 || { curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer; }
log "Composer OK"

# Node.js
if ! command -v node >/dev/null 2>&1 || [[ "$(node -v | cut -d. -f1 | tr -d 'v')" -lt 18 ]]; then
  info "Install Node.js 20 LTS..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y --no-install-recommends nodejs
fi
log "Node.js $(node -v) OK"

log "Semua dependency sistem terinstall"

# ================================================================
# 2. SALIN PROYEK KE APP_DIR
# ================================================================
section "2. Deploy Aplikasi"

if [[ "$ROOT_DIR" != "$APP_DIR" ]]; then
  if [[ -d "$APP_DIR" ]]; then
    warn "$APP_DIR sudah ada. Update source dari $ROOT_DIR..."
    rsync -a --delete --exclude='.env' --exclude='.env.production' --exclude='backend/.env' \
      --exclude='frontend/.env.production' --exclude='backend/vendor' --exclude='frontend/node_modules' \
      --exclude='backend/storage/logs/*.log' "$ROOT_DIR/" "$APP_DIR/"
  else
    info "Menyalin ke $APP_DIR..."
    rsync -a --exclude='.git' --exclude='backend/vendor' --exclude='frontend/node_modules' "$ROOT_DIR/" "$APP_DIR/"
  fi
  log "Source deployed ke $APP_DIR"
else
  info "Source sudah di $APP_DIR"
fi

cd "$APP_DIR"

# ================================================================
# 3. DATABASE
# ================================================================
section "3. Konfigurasi MySQL"

systemctl enable mysql && systemctl start mysql

if [[ -z "$DB_PASS" ]]; then
  DB_PASS="$(openssl rand -base64 18 | tr -dc 'a-zA-Z0-9' | head -c 20)"
  warn "Password DB auto-generated. Simpan ini!"
fi
echo -e "  ${BOLD}DB_USER${NC} : $DB_USER"
echo -e "  ${BOLD}DB_PASS${NC} : $DB_PASS"

mysql -u root <<SQL
DROP DATABASE IF EXISTS \`${DB_NAME}\`;
CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${DB_PASS}';
ALTER USER '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL
log "Database '$DB_NAME' siap"

# ================================================================
# 4. BACKEND LARAVEL
# ================================================================
section "4. Setup Backend Laravel"

cd "$BACKEND_DIR"
[[ ! -f ".env" ]] && cp ".env.production.example" ".env"

replace_env() {
  local file="$1" key="$2" value="$3"
  if grep -q "^${key}=" "$file" 2>/dev/null; then
    sed -i "s|^${key}=.*|${key}=${value}|" "$file"
  else
    echo "${key}=${value}" >> "$file"
  fi
}

replace_env ".env" "APP_URL"                  "$APP_URL"
replace_env ".env" "FRONTEND_URL"             "$APP_URL"
replace_env ".env" "CORS_ALLOWED_ORIGINS"     "$APP_URL"
replace_env ".env" "SESSION_DOMAIN"           "$APP_HOST"
replace_env ".env" "SANCTUM_STATEFUL_DOMAINS" "${APP_HOST},localhost:5173,127.0.0.1:5173"
replace_env ".env" "DB_CONNECTION"            "mysql"
replace_env ".env" "DB_HOST"                  "127.0.0.1"
replace_env ".env" "DB_PORT"                  "3306"
replace_env ".env" "DB_DATABASE"               "$DB_NAME"
replace_env ".env" "DB_USERNAME"              "$DB_USER"
replace_env ".env" "DB_PASSWORD"              "$DB_PASS"

if redis-cli ping 2>/dev/null | grep -q PONG; then
  replace_env ".env" "SESSION_DRIVER"   "redis"
  replace_env ".env" "CACHE_STORE"      "redis"
  replace_env ".env" "QUEUE_CONNECTION"  "redis"
  log "Redis OK → session/cache/queue via Redis"
else
  replace_env ".env" "SESSION_DRIVER"   "file"
  replace_env ".env" "CACHE_STORE"      "file"
  replace_env ".env" "QUEUE_CONNECTION" "database"
  warn "Redis tidak aktif → fallback file/database driver"
fi

[[ -z "$DOMAIN" ]] && replace_env ".env" "SESSION_SECURE_COOKIE" "false"

info "Composer install..."
composer install --no-dev --optimize-autoloader --no-interaction
php artisan key:generate --force

SQL_DUMP="$APP_DIR/sklidn.sql"
if [[ -f "$SQL_DUMP" ]]; then
  info "Import sklidn.sql..."
  MYSQL_PWD="$DB_PASS" mysql -h127.0.0.1 -P3306 -u"$DB_USER" "$DB_NAME" < "$SQL_DUMP"
  log "SQL dump imported"
fi

info "Migrasi + caching..."
php artisan migrate --force
php artisan storage:link || true
php artisan config:cache
php artisan route:cache
php artisan view:cache

chown -R "$APP_USER:$APP_USER" storage bootstrap/cache
chmod -R 775 storage bootstrap/cache
log "Backend siap"

# ================================================================
# 5. FRONTEND BUILD
# ================================================================
section "5. Build Frontend React"

cd "$FRONTEND_DIR"
[[ ! -f ".env.production" ]] && cp ".env.production.example" ".env.production"
replace_env ".env.production" "VITE_API_BASE_URL"     "$APP_URL/api"
replace_env ".env.production" "VITE_STORAGE_BASE_URL" "$APP_URL/storage"

info "npm install..."
npm ci
info "npm build..."
npm run build
log "Frontend build selesai → dist/"

# ================================================================
# 6. PHP-FPM + NGINX
# ================================================================
section "6. Konfigurasi PHP-FPM & Nginx"

PHP_FPM_SOCK="/run/php/php${PHP_VER}-fpm.sock"

# Optimasi pool
PHP_FPM_POOL="/etc/php/${PHP_VER}/fpm/pool.d/www.conf"
sed -i 's/^user = .*/user = www-data/' "$PHP_FPM_POOL"
sed -i 's/^group = .*/group = www-data/' "$PHP_FPM_POOL"
sed -i "s|^listen = .*|listen = $PHP_FPM_SOCK|" "$PHP_FPM_POOL"
sed -i 's/^;*listen.owner = .*/listen.owner = www-data/' "$PHP_FPM_POOL"
sed -i 's/^;*listen.group = .*/listen.group = www-data/' "$PHP_FPM_POOL"
sed -i 's/^pm = .*/pm = ondemand/' "$PHP_FPM_POOL"
sed -i 's/^pm.max_children = .*/pm.max_children = 20/' "$PHP_FPM_POOL"
sed -i 's/^;pm.process_idle_timeout = .*/pm.process_idle_timeout = 10s/' "$PHP_FPM_POOL"

# php.ini tuning
PHP_INI="/etc/php/${PHP_VER}/fpm/php.ini"
sed -i 's/^;*upload_max_filesize = .*/upload_max_filesize = 32M/' "$PHP_INI"
sed -i 's/^;*post_max_size = .*/post_max_size = 35M/' "$PHP_INI"
sed -i 's/^;*memory_limit = .*/memory_limit = 256M/' "$PHP_INI"
sed -i 's/^;*max_execution_time = .*/max_execution_time = 300/' "$PHP_INI"
sed -i 's/^expose_php = .*/expose_php = Off/' "$PHP_INI"

# Nginx config
NGINX_CONF="/etc/nginx/sites-available/sklidn"
SERVER_NAME_DIRECTIVE="${DOMAIN:-$SERVER_IP}"

cat > "$NGINX_CONF" <<NGINXCONF
server {
    listen ${HTTP_PORT};
    server_name ${SERVER_NAME_DIRECTIVE};

    root ${FRONTEND_DIR}/dist;
    index index.html;

    add_header Cross-Origin-Opener-Policy  "same-origin-allow-popups" always;
    add_header Cross-Origin-Embedder-Policy "unsafe-none"             always;
    add_header X-Content-Type-Options "nosniff"       always;
    add_header X-Frame-Options        "SAMEORIGIN"    always;
    add_header X-XSS-Protection       "1; mode=block" always;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /storage/ {
        alias ${BACKEND_DIR}/public/storage/;
        access_log off;
        expires 30d;
        add_header Cache-Control "public";
    }

    location ~ ^/(api|sanctum)(/.*)?\$ {
        include fastcgi_params;
        fastcgi_pass unix:${PHP_FPM_SOCK};
        fastcgi_param SCRIPT_FILENAME ${BACKEND_DIR}/public/index.php;
        fastcgi_param DOCUMENT_ROOT   ${BACKEND_DIR}/public;
        fastcgi_param REQUEST_URI     \$request_uri;
        fastcgi_read_timeout 300;
    }

    location ~ /\.(env|git|htaccess) {
        deny all;
    }

    client_max_body_size 32M;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
}
NGINXCONF

ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/sklidn
rm -f /etc/nginx/sites-enabled/default
nginx -t && log "Nginx config valid" || err "Nginx config invalid"

# ================================================================
# 7. SYSTEMD QUEUE WORKER
# ================================================================
section "7. Systemd Queue Worker"

cat > "/etc/systemd/system/${QUEUE_SERVICE}.service" <<UNITFILE
[Unit]
Description=SKLIDN Laravel Queue Worker
After=network.target mysql.service

[Service]
User=${APP_USER}
Group=${APP_USER}
WorkingDirectory=${BACKEND_DIR}
ExecStart=/usr/bin/php${PHP_VER} artisan queue:work --sleep=3 --tries=3 --max-time=3600 --memory=512
Restart=always
RestartSec=5
KillMode=mixed
KillSignal=SIGTERM
TimeoutStopSec=10

[Install]
WantedBy=multi-user.target
UNITFILE

systemctl daemon-reload
systemctl enable "${QUEUE_SERVICE}"
log "Systemd service $QUEUE_SERVICE siap"

# ================================================================
# 8. START SEMUA SERVICE + AUTO-START
# ================================================================
section "8. Start & Enable Auto-Start Semua Service"

SERVICES=("mysql" "php${PHP_VER}-fpm" "nginx" "$QUEUE_SERVICE")
systemctl is-enabled redis-server &>/dev/null && SERVICES=("redis-server" "${SERVICES[@]}") || true

for svc in "${SERVICES[@]}"; do
  systemctl enable "$svc" 2>/dev/null || true
  systemctl restart "$svc" && log "$svc → running" || warn "$svc gagal start (cek: journalctl -xe -u $svc)"
done
sleep 2

# ================================================================
# 9. SCRIPT PINTASAN GLOBAL
# ================================================================
section "9. Perintah Pintasan Global"

cat > /usr/local/bin/sklidn-start <<'EOF'
#!/usr/bin/env bash
sudo systemctl restart mysql php8.2-fpm nginx sklidn-queue redis-server 2>/dev/null || sudo systemctl restart mysql php8.2-fpm nginx sklidn-queue
sleep 1
IP=$(hostname -I | awk '{print $1}')
echo "SKLIDN: http://$IP"
EOF
chmod +x /usr/local/bin/sklidn-start

cat > /usr/local/bin/sklidn-status <<'EOF'
#!/usr/bin/env bash
for s in mysql php8.2-fpm nginx sklidn-queue redis-server; do
  if systemctl is-active --quiet "$s" 2>/dev/null; then echo "  [RUNNING] $s"; else echo "  [STOPPED] $s"; fi
done
IP=$(hostname -I | awk '{print $1}')
echo ""
echo "SKLIDN  : http://${IP}"
echo "API     : http://${IP}/api"
EOF
chmod +x /usr/local/bin/sklidn-status

cat > /usr/local/bin/sklidn-stop <<'EOF'
#!/usr/bin/env bash
sudo systemctl stop nginx php8.2-fpm sklidn-queue 2>/dev/null
echo "SKLIDN services dihentikan."
EOF
chmod +x /usr/local/bin/sklidn-stop

log "Perintah: sklidn-start | sklidn-stop | sklidn-status"

# ================================================================
# 10. CERTBOT (jika pakai domain)
# ================================================================
if [[ -n "$DOMAIN" ]]; then
  section "10. SSL via Certbot"
  if ! command -v certbot >/dev/null 2>&1; then
    apt-get install -y --no-install-recommends certbot python3-certbot-nginx 2>/dev/null || true
  fi
  if command -v certbot >/dev/null 2>&1; then
    info "Menjalankan certbot untuk $DOMAIN..."
    certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "admin@${DOMAIN}" 2>/dev/null || \
    certbot --nginx -d "$DOMAIN" 2>&1 || \
    warn "SSL gagal otomatis. Jalankan manual: certbot --nginx -d $DOMAIN"
  fi
fi

# ================================================================
# SELESAI!
# ================================================================
section "SKLIDN Berhasil Terinstall!"

echo ""
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${GREEN}║        SKLIDN - AKTIF & SIAP DIGUNAKAN          ║${NC}"
echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BOLD}Buka Browser${NC}   : ${CYAN}http://${SERVER_IP}:${HTTP_PORT}${NC}"
if [[ -n "$DOMAIN" ]]; then
  echo -e "  ${BOLD}Domain${NC}         : ${CYAN}https://${DOMAIN}${NC}"
fi
echo ""
echo -e "  ${BOLD}Manajemen:${NC}"
echo -e "   ${GREEN}sklidn-status${NC}  → Cek status service"
echo -e "   ${GREEN}sklidn-start${NC}   → Start ulang semua service"
echo -e "   ${GREEN}sklidn-stop${NC}    → Stop semua service"
echo ""
echo -e "  ${BOLD}Database:${NC}"
echo -e "   Nama      : ${DB_NAME}"
echo -e "   User      : ${DB_USER}"
echo -e "   Password  : ${DB_PASS}"
echo ""
echo -e "  ${GREEN}Aplikasi auto-start saat server reboot.${NC}"
echo -e "  ${YELLOW}Simpan password database di atas!${NC}"
echo ""
echo -e "${BOLD}${GREEN}══════════════════════════════════════════════════${NC}"
echo ""