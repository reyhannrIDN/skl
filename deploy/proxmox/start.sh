#!/usr/bin/env bash
# ============================================================
# SKLIDN - Quick Start Script
# Menjalankan ulang semua service dan menampilkan URL akses
# Usage: sudo bash deploy/proxmox/start.sh
#   atau: sklidn-start  (setelah setup-autostart.sh dijalankan)
# ============================================================
set -euo pipefail

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

[[ "$EUID" -ne 0 ]] && exec sudo bash "$0" "$@"

# Deteksi PHP version yang terinstal
PHP_VER=$(php -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;" 2>/dev/null || echo "8.2")

# Port HTTP dari nginx config
HTTP_PORT=$(grep -E '^\s*listen\s+[0-9]+' /etc/nginx/sites-enabled/sklidn 2>/dev/null \
  | head -1 | grep -oP '\d+' | tail -1 || echo "80")

# ── Restart services ─────────────────────────────────────────
echo ""
echo -e "${BOLD}${CYAN}══════════════════════════════════════════${NC}"
echo -e "${BOLD}${CYAN}   SKLIDN - Memulai Semua Service         ${NC}"
echo -e "${BOLD}${CYAN}══════════════════════════════════════════${NC}"
echo ""

SERVICES=("mysql" "php${PHP_VER}-fpm" "nginx" "sklidn-queue")
# Tambahkan redis jika ada
systemctl is-enabled redis-server &>/dev/null && SERVICES=("redis-server" "${SERVICES[@]}") || true

# Pastikan Apache tidak rebutan port dengan Nginx
if systemctl is-active --quiet apache2 2>/dev/null; then
  echo -e "  ${YELLOW}!${NC}  Apache2 sedang berjalan — dihentikan agar tidak konflik dengan Nginx"
  systemctl stop apache2 && systemctl disable apache2 2>/dev/null || true
fi

FAILED=()
for svc in "${SERVICES[@]}"; do
  if systemctl restart "$svc" 2>/dev/null; then
    echo -e "  ${GREEN}✔${NC}  $svc"
  else
    echo -e "  ${RED}✘${NC}  $svc ${RED}(gagal)${NC}"
    FAILED+=("$svc")
  fi
done

# Tunggu services siap
sleep 2

# ── Tampilkan status & URL ───────────────────────────────────
SERVER_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
[[ -z "$SERVER_IP" ]] && SERVER_IP=$(ip route get 1.1.1.1 2>/dev/null | awk '{print $7; exit}')
[[ -z "$SERVER_IP" ]] && SERVER_IP="127.0.0.1"

# Deteksi domain dari nginx config
DOMAIN=$(grep -E '^\s*server_name\s+' /etc/nginx/sites-enabled/sklidn 2>/dev/null \
  | awk '{print $2}' | tr -d ';' || echo "")
[[ "$DOMAIN" == "$SERVER_IP" ]] && DOMAIN=""

echo ""
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${GREEN}║          SKLIDN - Aplikasi Sedang Berjalan       ║${NC}"
echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BOLD}Server IP${NC}     : ${SERVER_IP}"
echo -e "  ${BOLD}HTTP Port${NC}     : ${HTTP_PORT}"
echo ""
echo -e "  ${BOLD}Akses via Browser:${NC}"
echo -e "  ┌─────────────────────────────────────────────────┐"
echo -e "  │  ${CYAN}http://${SERVER_IP}:${HTTP_PORT}${NC}"
if [[ -n "$DOMAIN" ]]; then
echo -e "  │  ${CYAN}https://${DOMAIN}${NC}"
fi
echo -e "  └─────────────────────────────────────────────────┘"
echo ""
echo -e "  ${BOLD}Endpoint:${NC}"
echo -e "   Frontend Web  →  http://${SERVER_IP}:${HTTP_PORT}"
echo -e "   Backend API   →  http://${SERVER_IP}:${HTTP_PORT}/api"
echo -e "   Storage       →  http://${SERVER_IP}:${HTTP_PORT}/storage"
echo ""

# Status ringkas
echo -e "  ${BOLD}Status Service:${NC}"
for svc in "${SERVICES[@]}"; do
  if systemctl is-active --quiet "$svc" 2>/dev/null; then
    echo -e "   ${GREEN}●${NC}  $svc  ${GREEN}running${NC}"
  else
    echo -e "   ${RED}●${NC}  $svc  ${RED}stopped${NC}"
  fi
done

echo ""
if [[ ${#FAILED[@]} -gt 0 ]]; then
  echo -e "  ${YELLOW}⚠  Service berikut gagal start: ${FAILED[*]}${NC}"
  echo -e "  ${YELLOW}   Jalankan: journalctl -xe -u <nama-service>  untuk debug${NC}"
  echo ""
fi

echo -e "${BOLD}${GREEN}══════════════════════════════════════════════════${NC}"
echo ""
