#!/usr/bin/env bash
# ============================================================
# SKLIDN - Status Display Script
# Menampilkan status semua service dan URL akses
# Usage: bash deploy/proxmox/status.sh
#   atau: sklidn-status  (setelah setup-autostart.sh dijalankan)
# ============================================================

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

PHP_VER=$(php -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;" 2>/dev/null || echo "8.2")
HTTP_PORT=$(grep -E '^\s*listen\s+[0-9]+' /etc/nginx/sites-enabled/sklidn 2>/dev/null \
  | head -1 | grep -oP '\d+' | tail -1 || echo "80")
SERVER_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
[[ -z "$SERVER_IP" ]] && SERVER_IP=$(ip route get 1.1.1.1 2>/dev/null | awk '{print $7; exit}')
[[ -z "$SERVER_IP" ]] && SERVER_IP="127.0.0.1"
DOMAIN=$(grep -E '^\s*server_name\s+' /etc/nginx/sites-enabled/sklidn 2>/dev/null \
  | awk '{print $2}' | tr -d ';' || echo "")
[[ "$DOMAIN" == "$SERVER_IP" ]] && DOMAIN=""

echo ""
echo -e "${BOLD}${CYAN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${CYAN}║            SKLIDN - Status Server                ║${NC}"
echo -e "${BOLD}${CYAN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  Waktu     : $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo -e "  Server IP : ${SERVER_IP}"
echo -e "  HTTP Port : ${HTTP_PORT}"
echo ""

# ── Status service ──────────────────────────────────────────
echo -e "  ${BOLD}Service Status:${NC}"
echo -e "  ┌────────────────────────────────────────┐"

print_status() {
  local name="$1"
  local svc="$2"
  if systemctl is-active --quiet "$svc" 2>/dev/null; then
    local uptime
    uptime=$(systemctl show "$svc" --property=ActiveEnterTimestamp 2>/dev/null \
      | cut -d= -f2 | sed 's/ [A-Z]*$//' || echo "-")
    echo -e "  │  ${GREEN}●${NC}  ${BOLD}${name}${NC}${NC}  ${GREEN}running${NC}  (sejak: ${uptime})"
  else
    echo -e "  │  ${RED}●${NC}  ${BOLD}${name}${NC}  ${RED}stopped${NC}"
  fi
}

print_status "MySQL        " "mysql"
print_status "PHP-FPM      " "php${PHP_VER}-fpm"
print_status "Nginx        " "nginx"
print_status "Queue Worker " "sklidn-queue"
systemctl is-enabled redis-server &>/dev/null && \
  print_status "Redis        " "redis-server" || true

# Deteksi Apache2 (konflik potensial)
if systemctl is-active --quiet apache2 2>/dev/null; then
  echo -e "  │  ${RED}⚠${NC}  ${BOLD}Apache2       ${NC}  ${RED}AKTIF — konflik dengan Nginx!${NC}"
  echo -e "  │      ${YELLOW}→ Jalankan: systemctl stop apache2 && systemctl disable apache2${NC}"
fi

echo -e "  └────────────────────────────────────────┘"
echo ""

# ── URL Akses ───────────────────────────────────────────────
echo -e "  ${BOLD}URL Akses:${NC}"
echo -e "  ┌─────────────────────────────────────────────────┐"
echo -e "  │  Frontend   →  ${CYAN}http://${SERVER_IP}:${HTTP_PORT}${NC}"
echo -e "  │  API        →  ${CYAN}http://${SERVER_IP}:${HTTP_PORT}/api${NC}"
echo -e "  │  Storage    →  ${CYAN}http://${SERVER_IP}:${HTTP_PORT}/storage${NC}"
if [[ -n "$DOMAIN" ]]; then
echo -e "  │  Domain     →  ${CYAN}https://${DOMAIN}${NC}"
fi
echo -e "  └─────────────────────────────────────────────────┘"
echo ""

# ── Cek konektivitas HTTP ───────────────────────────────────
if command -v curl >/dev/null 2>&1; then
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    --connect-timeout 3 "http://127.0.0.1:${HTTP_PORT}" 2>/dev/null || echo "000")
  if [[ "$HTTP_CODE" =~ ^[23] ]]; then
    echo -e "  ${GREEN}✔${NC}  HTTP response: ${HTTP_CODE} (OK)"
  elif [[ "$HTTP_CODE" == "000" ]]; then
    echo -e "  ${RED}✘${NC}  Nginx tidak merespons di port ${HTTP_PORT}"
  else
    echo -e "  ${YELLOW}!${NC}  HTTP response: ${HTTP_CODE}"
  fi

  API_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
    --connect-timeout 3 "http://127.0.0.1:${HTTP_PORT}/api/health" 2>/dev/null || echo "000")
  if [[ "$API_CODE" =~ ^[234] ]]; then
    echo -e "  ${GREEN}✔${NC}  API response: ${API_CODE} (OK)"
  else
    echo -e "  ${YELLOW}!${NC}  API response: ${API_CODE}"
  fi
  echo ""
fi

# ── Penggunaan resource ─────────────────────────────────────
echo -e "  ${BOLD}Resource:${NC}"
# Disk
DISK_USAGE=$(df -h /var/www 2>/dev/null | tail -1 | awk '{print $3"/"$2" ("$5")"}' || echo "-")
echo -e "  Disk /var/www : $DISK_USAGE"
# RAM
RAM_USAGE=$(free -h | awk '/^Mem:/ {print $3"/"$2}')
echo -e "  RAM           : $RAM_USAGE"
# Load average
LOAD=$(uptime | awk -F'load average:' '{print $2}' | xargs)
echo -e "  Load Avg      : $LOAD"

echo ""
echo -e "  ${BOLD}Perintah berguna:${NC}"
echo -e "   ${GREEN}sklidn-start${NC}    → restart & tampilkan URL"
echo -e "   ${GREEN}sklidn-stop${NC}     → hentikan semua service"
echo -e "   journalctl -f -u nginx               → log nginx"
echo -e "   journalctl -f -u sklidn-queue        → log queue"
echo -e "   tail -f /var/www/SKLIDN/backend/storage/logs/laravel.log"
echo ""
echo -e "${BOLD}${CYAN}══════════════════════════════════════════════════${NC}"
echo ""
