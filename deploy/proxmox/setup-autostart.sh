#!/usr/bin/env bash
# ============================================================
# SKLIDN - Proxmox Auto-Start Setup Script
# Jalankan sekali di server Proxmox (LXC/VM Debian/Ubuntu):
#   sudo bash deploy/proxmox/setup-autostart.sh
#
# Opsi environment:
#   DOMAIN=skl.idnbogor.id   sudo -E bash ...  (pakai domain)
#   PORT=8080                sudo -E bash ...  (ganti port HTTP)
#   DB_PASS=secret           sudo -E bash ...  (password MySQL)
#   SKIP_BUILD=1             sudo -E bash ...  (skip install deps & build)
# ============================================================
set -euo pipefail

# ── Warna & helper ──────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

log()  { echo -e "${GREEN}[✔]${NC} $*"; }
info() { echo -e "${BLUE}[i]${NC} $*"; }
warn() { echo -e "${YELLOW}[!]${NC} $*"; }
err()  { echo -e "${RED}[✘]${NC} $*" >&2; exit 1; }
section() { echo -e "\n${BOLD}${CYAN}═══ $* ═══${NC}"; }

# ── Konfigurasi ─────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
APP_DIR="${APP_DIR:-/var/www/SKLIDN}"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
PHP_VER="8.2"
HTTP_PORT="${PORT:-80}"
DOMAIN="${DOMAIN:-}"     # Kosong = pakai IP saja
DB_NAME="${DB_NAME:-sklidn}"
DB_USER="${DB_USER:-sklidn_user}"
DB_PASS="${DB_PASS:-}"
SKIP_BUILD="${SKIP_BUILD:-0}"
QUEUE_SERVICE="sklidn-queue"
APP_USER="www-data"

# ── Cek root ────────────────────────────────────────────────
[[ "$EUID" -ne 0 ]] && err "Jalankan sebagai root: sudo bash $0"

# ── Deteksi IP server ───────────────────────────────────────
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

section "SKLIDN Setup Proxmox — $(date '+%Y-%m-%d %H:%M:%S')"
info "Server IP   : $SERVER_IP"
info "App Host    : $APP_HOST"
info "HTTP Port   : $HTTP_PORT"
info "App Dir     : $APP_DIR"
info "PHP Version : $PHP_VER"
echo ""

# ── Fungsi utilitas ─────────────────────────────────────────
require_cmd() { command -v "$1" >/dev/null 2>&1 || err "Command tidak ditemukan: $1"; }

apt_install() {
  DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends "$@"
}

replace_env() {
  local file="$1" key="$2" value="$3"
  if grep -q "^${key}=" "$file" 2>/dev/null; then
    sed -i "s|^${key}=.*|${key}=${value}|" "$file"
  else
    echo "${key}=${value}" >> "$file"
  fi
}

service_active() { systemctl is-active --quiet "$1" 2>/dev/null; }

# ── 1. Instal dependency sistem ─────────────────────────────
if [[ "$SKIP_BUILD" != "1" ]]; then
  section "1. Instal Dependency Sistem"

  # ── Wajib: Nonaktifkan & hapus Apache2 dahulu ──────────────
  # Proxmox LXC Ubuntu sering pre-install Apache2. Jika dibiarkan,
  # Apache akan rebutan port 80 dengan Nginx dan menyebabkan konflik.
  if systemctl is-active --quiet apache2 2>/dev/null; then
    warn "Apache2 terdeteksi sedang berjalan — menghentikan..."
    systemctl stop apache2
    systemctl disable apache2
    log "Apache2 dihentikan dan dinonaktifkan"
  fi
  if command -v apache2 >/dev/null 2>&1; then
    info "Mengahapus Apache2 dan libapache2-mod-php jika ada..."
    DEBIAN_FRONTEND=noninteractive apt-get remove -y --purge \
      apache2 apache2-bin apache2-data apache2-utils \
      libapache2-mod-php* 2>/dev/null || true
    apt-get autoremove -y 2>/dev/null || true
    log "Apache2 dihapus"
  fi

  apt-get update -qq
  apt_install software-properties-common curl gnupg ca-certificates lsb-release unzip git

  # PHP 8.2-FPM (wajib pakai FPM — bukan mod_php Apache)
  if ! php -v 2>/dev/null | grep -q "PHP $PHP_VER"; then
    info "Menambahkan PPA PHP Ondrej..."
    add-apt-repository -y ppa:ondrej/php 2>/dev/null || \
      { curl -sSL https://packages.sury.org/php/apt.gpg | gpg --dearmor -o /usr/share/keyrings/sury-php.gpg
        echo "deb [signed-by=/usr/share/keyrings/sury-php.gpg] https://packages.sury.org/php/ $(lsb_release -sc) main" \
          > /etc/apt/sources.list.d/sury-php.list
        apt-get update -qq; }
    apt_install \
      php${PHP_VER} php${PHP_VER}-fpm php${PHP_VER}-cli php${PHP_VER}-mysql \
      php${PHP_VER}-redis php${PHP_VER}-xml php${PHP_VER}-mbstring \
      php${PHP_VER}-curl php${PHP_VER}-zip php${PHP_VER}-bcmath \
      php${PHP_VER}-tokenizer php${PHP_VER}-fileinfo php${PHP_VER}-intl \
      php${PHP_VER}-gd
  else
    log "PHP $PHP_VER sudah terinstal"
    # Pastikan libapache2-mod-php TIDAK terinstal bersamaan dengan FPM
    DEBIAN_FRONTEND=noninteractive apt-get remove -y --purge \
      libapache2-mod-php${PHP_VER} libapache2-mod-php 2>/dev/null || true
  fi

  # Nginx (web server utama — menggantikan Apache sepenuhnya)
  if ! command -v nginx >/dev/null 2>&1; then
    apt_install nginx
  else
    log "Nginx sudah terinstal"
  fi

  # MySQL
  if ! command -v mysql >/dev/null 2>&1; then
    apt_install mysql-server
  else
    log "MySQL sudah terinstal"
  fi

  # Redis (optional tapi direkomendasikan)
  if ! command -v redis-cli >/dev/null 2>&1; then
    apt_install redis-server || warn "Redis tidak berhasil diinstal, fallback ke file driver"
  else
    log "Redis sudah terinstal"
  fi

  # Composer
  if ! command -v composer >/dev/null 2>&1; then
    info "Menginstal Composer..."
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
  else
    log "Composer sudah terinstal"
  fi

  # Node.js (via NodeSource)
  if ! command -v node >/dev/null 2>&1 || [[ "$(node -v | cut -d. -f1 | tr -d 'v')" -lt 18 ]]; then
    info "Menginstal Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt_install nodejs
  else
    log "Node.js $(node -v) sudah terinstal"
  fi
fi

# ── 2. Salin/link direktori aplikasi ────────────────────────
section "2. Deploy Direktori Aplikasi"

if [[ "$ROOT_DIR" != "$APP_DIR" ]]; then
  if [[ -d "$APP_DIR" ]]; then
    warn "$APP_DIR sudah ada, melewati penyalinan (gunakan --rsync manual jika perlu update)"
  else
    info "Menyalin dari $ROOT_DIR ke $APP_DIR ..."
    rsync -a --exclude='.git' --exclude='backend/vendor' \
      --exclude='frontend/node_modules' --exclude='backend/storage/logs/*.log' \
      "$ROOT_DIR/" "$APP_DIR/"
    log "Salin selesai"
  fi
else
  info "Aplikasi sudah berada di $APP_DIR"
fi

# ── 3. Konfigurasi Database ──────────────────────────────────
section "3. Konfigurasi MySQL"

systemctl enable mysql && systemctl start mysql

if [[ -z "$DB_PASS" ]]; then
  DB_PASS="$(openssl rand -base64 18 | tr -dc 'a-zA-Z0-9' | head -c 20)"
  warn "Password DB di-generate otomatis. Simpan ini:"
  echo -e "  ${BOLD}DB_USER=${DB_USER}${NC}"
  echo -e "  ${BOLD}DB_PASS=${DB_PASS}${NC}"
fi

# Selalu hapus dan buat ulang database (fresh import setiap deploy)
warn "Menghapus database '$DB_NAME' jika ada, lalu membuat ulang..."
mysql --defaults-extra-file=<(printf '[client]\nuser=root\n') 2>/dev/null <<SQL || \
mysql -u root 2>/dev/null <<SQL
DROP DATABASE IF EXISTS \`${DB_NAME}\`;
CREATE DATABASE \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${DB_PASS}';
ALTER USER '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL
log "Database '$DB_NAME' di-drop dan dibuat ulang. User '$DB_USER' siap."

# ── 4. Konfigurasi Backend (.env) ───────────────────────────
section "4. Konfigurasi Backend Laravel"

cd "$BACKEND_DIR"

if [[ ! -f ".env" ]]; then
  cp ".env.production.example" ".env"
  info "File .env dibuat dari .env.production.example"
fi

# Sesuaikan nilai env
replace_env ".env" "APP_URL"                  "$APP_URL"
replace_env ".env" "FRONTEND_URL"             "$APP_URL"
replace_env ".env" "CORS_ALLOWED_ORIGINS"     "$APP_URL"
replace_env ".env" "SESSION_DOMAIN"           "$APP_HOST"
replace_env ".env" "SANCTUM_STATEFUL_DOMAINS" "${APP_HOST},localhost:5173,127.0.0.1:5173"
replace_env ".env" "DB_CONNECTION"            "mysql"
replace_env ".env" "DB_HOST"                  "127.0.0.1"
replace_env ".env" "DB_PORT"                  "3306"
replace_env ".env" "DB_DATABASE"              "$DB_NAME"
replace_env ".env" "DB_USERNAME"              "$DB_USER"
replace_env ".env" "DB_PASSWORD"              "$DB_PASS"

# Cek Redis
if command -v redis-cli >/dev/null 2>&1 && redis-cli ping 2>/dev/null | grep -q PONG; then
  replace_env ".env" "SESSION_DRIVER"  "redis"
  replace_env ".env" "CACHE_STORE"     "redis"
  replace_env ".env" "QUEUE_CONNECTION" "redis"
  log "Redis terdeteksi → session/cache/queue menggunakan Redis"
else
  replace_env ".env" "SESSION_DRIVER"  "file"
  replace_env ".env" "CACHE_STORE"     "file"
  replace_env ".env" "QUEUE_CONNECTION" "database"
  warn "Redis tidak terdeteksi → fallback ke file/database driver"
fi

# Nonaktifkan secure cookie jika pakai HTTP (tanpa domain/SSL)
if [[ -z "$DOMAIN" ]]; then
  replace_env ".env" "SESSION_SECURE_COOKIE" "false"
  replace_env ".env" "APP_ENV"               "production"
fi

if [[ "$SKIP_BUILD" != "1" ]]; then
  info "Menginstal Composer dependencies..."
  composer install --no-dev --optimize-autoloader --no-interaction

  info "Membuat APP_KEY..."
  php artisan key:generate --force

  # Selalu import sklidn.sql (sudah drop+create di atas)
  SQL_DUMP="$APP_DIR/sklidn.sql"
  if [[ -f "$SQL_DUMP" ]]; then
    info "Mengimpor sklidn.sql ke database '$DB_NAME'..."
    MYSQL_PWD="$DB_PASS" mysql -h127.0.0.1 -P3306 -u"$DB_USER" "$DB_NAME" < "$SQL_DUMP"
    log "SQL dump berhasil diimpor"
    info "Menjalankan migrasi untuk tabel yang belum ada..."
    php artisan migrate --force
  else
    warn "sklidn.sql tidak ditemukan di $APP_DIR — menjalankan migrasi fresh..."
    php artisan migrate --force
  fi

  php artisan storage:link || true
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
fi

# Set permission
chown -R "$APP_USER:$APP_USER" "$BACKEND_DIR/storage" "$BACKEND_DIR/bootstrap/cache"
chmod -R 775 "$BACKEND_DIR/storage" "$BACKEND_DIR/bootstrap/cache"
log "Permission backend OK"

# ── 5. Build Frontend ────────────────────────────────────────
if [[ "$SKIP_BUILD" != "1" ]]; then
  section "5. Build Frontend"
  cd "$FRONTEND_DIR"

  if [[ ! -f ".env.production" ]]; then
    cp ".env.production.example" ".env.production"
  fi
  replace_env ".env.production" "VITE_API_BASE_URL"     "$APP_URL/api"
  replace_env ".env.production" "VITE_STORAGE_BASE_URL" "$APP_URL/storage"

  info "Menginstal npm packages..."
  npm ci
  info "Build frontend..."
  npm run build
  log "Frontend build selesai → $FRONTEND_DIR/dist"
fi

# ── 6. Konfigurasi PHP-FPM pool untuk Nginx ─────────────────
section "6. Konfigurasi PHP-FPM + Nginx"

PHP_FPM_SOCK="/run/php/php${PHP_VER}-fpm.sock"
PHP_FPM_POOL="/etc/php/${PHP_VER}/fpm/pool.d/www.conf"

if [[ -f "$PHP_FPM_POOL" ]]; then
  info "Mengoptimalkan PHP-FPM pool (www.conf) untuk Nginx..."
  # Pastikan user/group cocok dengan Nginx (www-data)
  sed -i 's/^user = .*/user = www-data/'              "$PHP_FPM_POOL"
  sed -i 's/^group = .*/group = www-data/'            "$PHP_FPM_POOL"
  # Socket Unix (lebih cepat dari TCP untuk komunikasi Nginx↔FPM di host sama)
  sed -i "s|^listen = .*|listen = $PHP_FPM_SOCK|"    "$PHP_FPM_POOL"
  # Pastikan socket bisa dibaca oleh Nginx
  sed -i 's/^;listen.owner = .*/listen.owner = www-data/' "$PHP_FPM_POOL"
  sed -i 's/^;listen.group = .*/listen.group = www-data/' "$PHP_FPM_POOL"
  sed -i 's/^listen.owner = .*/listen.owner = www-data/'  "$PHP_FPM_POOL"
  sed -i 's/^listen.group = .*/listen.group = www-data/'  "$PHP_FPM_POOL"
  # Mode ondemand hemat RAM untuk LXC container
  sed -i 's/^pm = .*/pm = ondemand/'                 "$PHP_FPM_POOL"
  sed -i 's/^pm.max_children = .*/pm.max_children = 20/'  "$PHP_FPM_POOL"
  sed -i 's/^;pm.process_idle_timeout = .*/pm.process_idle_timeout = 10s/' "$PHP_FPM_POOL"
  log "PHP-FPM pool dikonfigurasi: user=www-data, socket=$PHP_FPM_SOCK"
fi

# Konfigurasi PHP.ini untuk produksi
PHP_INI="/etc/php/${PHP_VER}/fpm/php.ini"
if [[ -f "$PHP_INI" ]]; then
  sed -i 's/^;*upload_max_filesize = .*/upload_max_filesize = 32M/' "$PHP_INI"
  sed -i 's/^;*post_max_size = .*/post_max_size = 35M/'             "$PHP_INI"
  sed -i 's/^;*memory_limit = .*/memory_limit = 256M/'              "$PHP_INI"
  sed -i 's/^;*max_execution_time = .*/max_execution_time = 300/'   "$PHP_INI"
  # Nonaktifkan expose_php (jangan bocorkan versi PHP ke header)
  sed -i 's/^expose_php = .*/expose_php = Off/'                     "$PHP_INI"
  log "PHP.ini produksi dikonfigurasi"
fi

# Hardening nginx.conf global (tambah server_tokens off jika belum)
NGINX_MAIN="/etc/nginx/nginx.conf"
if ! grep -q 'server_tokens off' "$NGINX_MAIN" 2>/dev/null; then
  sed -i '/http {/a \\tserver_tokens off;' "$NGINX_MAIN"
  log "nginx.conf: server_tokens off ditambahkan"
fi

NGINX_CONF="/etc/nginx/sites-available/sklidn"
SERVER_NAME_DIRECTIVE="${DOMAIN:-$SERVER_IP}"

cat > "$NGINX_CONF" <<NGINXCONF
# SKLIDN - Auto-generate oleh setup-autostart.sh
server {
    listen ${HTTP_PORT};
    server_name ${SERVER_NAME_DIRECTIVE};

    # Frontend (React/Vite build output)
    root ${FRONTEND_DIR}/dist;
    index index.html;

    # ── WAJIB: COOP header agar Google OAuth popup bekerja ─────────
    # SecurityHeaders.php middleware hanya berlaku untuk PHP responses.
    # File index.html dilayani langsung Nginx (tanpa melewati PHP),
    # sehingga header ini HARUS diset di sini.
    add_header Cross-Origin-Opener-Policy  "same-origin-allow-popups" always;
    add_header Cross-Origin-Embedder-Policy "unsafe-none"             always;
    # Header keamanan umum
    add_header X-Content-Type-Options "nosniff"       always;
    add_header X-Frame-Options        "SAMEORIGIN"    always;
    add_header X-XSS-Protection       "1; mode=block" always;

    # ── Frontend SPA ─────────────────────────────────────────────────
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # ── Storage Laravel ───────────────────────────────────────────────
    location /storage/ {
        alias ${BACKEND_DIR}/public/storage/;
        access_log off;
        expires 30d;
        add_header Cache-Control "public";
    }

    # ── API & Sanctum → PHP-FPM langsung (tanpa try_files) ──────────
    # try_files + internal redirect ke /index.php dapat kehilangan
    # REQUEST_URI asli → Laravel tidak bisa match route → 404.
    # Solusi: langsung fastcgi_pass dengan SCRIPT_FILENAME eksplisit.
    location ~ ^/(api|sanctum)(/.*)?\$ {
        include fastcgi_params;
        fastcgi_pass unix:${PHP_FPM_SOCK};
        fastcgi_param SCRIPT_FILENAME ${BACKEND_DIR}/public/index.php;
        fastcgi_param DOCUMENT_ROOT   ${BACKEND_DIR}/public;
        fastcgi_param REQUEST_URI     \$request_uri;
        fastcgi_read_timeout 300;
    }

    # ── Blok akses ke file sensitif ───────────────────────────────────
    location ~ /\.(env|git|htaccess) {
        deny all;
    }

    client_max_body_size 32M;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
}
NGINXCONF

# Aktifkan site
ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/sklidn
# Hapus default site jika masih ada
rm -f /etc/nginx/sites-enabled/default

nginx -t && log "Konfigurasi nginx valid" || err "Konfigurasi nginx tidak valid, periksa $NGINX_CONF"

# ── 7. Systemd Queue Worker ──────────────────────────────────
section "7. Systemd Service Queue Worker"

cat > "/etc/systemd/system/${QUEUE_SERVICE}.service" <<UNITFILE
[Unit]
Description=SKLIDN Laravel Queue Worker
Documentation=https://laravel.com/docs/queues
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
log "Systemd service $QUEUE_SERVICE terdaftar"

# ── 8. Start & Enable semua service ──────────────────────────
section "8. Memulai dan Mengaktifkan Semua Service"

# Pastikan Apache2 benar-benar tidak berjalan sebelum Nginx start
if systemctl is-active --quiet apache2 2>/dev/null; then
  systemctl stop apache2 && systemctl disable apache2
  warn "Apache2 dihentikan paksa sebelum Nginx distart"
fi

# Pastikan tidak ada proses di port HTTP_PORT yang bukan Nginx
if command -v ss >/dev/null 2>&1; then
  PORTPID=$(ss -tlnp "sport = :${HTTP_PORT}" 2>/dev/null | grep -v nginx | awk '/LISTEN/{print $NF}' | grep -oP 'pid=\K[0-9]+' || true)
  if [[ -n "$PORTPID" ]]; then
    warn "Port ${HTTP_PORT} masih dipakai PID $PORTPID — menghentikan..."
    kill -9 "$PORTPID" 2>/dev/null || true
  fi
fi

SERVICES=("mysql" "php${PHP_VER}-fpm" "nginx" "$QUEUE_SERVICE")
command -v redis-cli >/dev/null 2>&1 && SERVICES=("redis-server" "${SERVICES[@]}") || true

for svc in "${SERVICES[@]}"; do
  systemctl enable "$svc" 2>/dev/null || true
  systemctl restart "$svc" && log "$svc → aktif" || warn "$svc gagal distart"
done

# Tunggu sebentar agar semua service siap
sleep 2

# ── 9. Buat skrip pintasan (start/stop/status) ───────────────
section "9. Membuat Skrip Pintasan"

# Salin start.sh dan status.sh ke /usr/local/bin agar bisa diakses global
HELPER_DIR="$SCRIPT_DIR"

cat > /usr/local/bin/sklidn-start <<STARTSCRIPT
#!/usr/bin/env bash
bash "${HELPER_DIR}/start.sh"
STARTSCRIPT

cat > /usr/local/bin/sklidn-status <<STATUSSCRIPT
#!/usr/bin/env bash
bash "${HELPER_DIR}/status.sh"
STATUSSCRIPT

cat > /usr/local/bin/sklidn-stop <<STOPSCRIPT
#!/usr/bin/env bash
systemctl stop nginx php${PHP_VER}-fpm ${QUEUE_SERVICE} 2>/dev/null || true
echo "SKLIDN services dihentikan."
STOPSCRIPT

chmod +x /usr/local/bin/sklidn-start /usr/local/bin/sklidn-status /usr/local/bin/sklidn-stop
log "Perintah global: sklidn-start | sklidn-status | sklidn-stop"

# ── 10. Laporan Akhir ────────────────────────────────────────
section "SKLIDN Berhasil Di-deploy!"

SERVER_IP_NOW=$(hostname -I | awk '{print $1}')

echo ""
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${GREEN}║        SKLIDN - Informasi Akses Aplikasi         ║${NC}"
echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BOLD}Frontend (Web)${NC}     : ${CYAN}http://${SERVER_IP_NOW}:${HTTP_PORT}${NC}"
echo -e "  ${BOLD}Backend API${NC}        : ${CYAN}http://${SERVER_IP_NOW}:${HTTP_PORT}/api${NC}"
echo -e "  ${BOLD}Storage Files${NC}      : ${CYAN}http://${SERVER_IP_NOW}:${HTTP_PORT}/storage${NC}"
if [[ -n "$DOMAIN" ]]; then
echo ""
echo -e "  ${BOLD}Domain (HTTPS)${NC}     : ${CYAN}https://${DOMAIN}${NC}"
echo -e "  ${YELLOW}  → Pastikan DNS sudah diarahkan ke IP ${SERVER_IP_NOW}${NC}"
echo -e "  ${YELLOW}  → Jalankan: certbot --nginx -d ${DOMAIN} untuk SSL gratis${NC}"
fi
echo ""
echo -e "  ${BOLD}Database${NC}           : ${DB_NAME}"
echo -e "  ${BOLD}DB User${NC}            : ${DB_USER}"
echo -e "  ${BOLD}DB Password${NC}        : ${DB_PASS}"
echo ""
echo -e "  ${BOLD}Perintah berguna:${NC}"
echo -e "   ${GREEN}sklidn-status${NC}   → cek status semua service"
echo -e "   ${GREEN}sklidn-start${NC}    → start/restart semua service"
echo -e "   ${GREEN}sklidn-stop${NC}     → hentikan semua service"
echo ""
echo -e "  ${BOLD}Auto-start aktif.${NC} Service akan otomatis jalan saat server reboot."
echo ""
echo -e "${BOLD}${GREEN}══════════════════════════════════════════════════${NC}"
