# Deploy Proxmox (skl.idnbogor.id)

Panduan ini menyiapkan server Proxmox tanpa mengubah setup lokal.

## 1) Di server Proxmox

```bash
cd /var/www/SKLIDN
chmod +x deploy/proxmox/install.sh
DOMAIN=skl.idnbogor.id ./deploy/proxmox/install.sh
```

Script akan:
- Membuat `backend/.env` dari `backend/.env.production.example` hanya jika file belum ada.
- Membuat `frontend/.env.production` dari `frontend/.env.production.example` hanya jika file belum ada.
- Membuat database MySQL lalu import dump `sklidn.sql` otomatis (jika file tersedia).
- Install dependency backend/frontend.
- Build asset backend/frontend.
- Menjalankan migrasi lanjutan (jika tabel `migrations` tersedia) dan optimasi Laravel.

## Konfigurasi database

Pastikan nilai berikut di `backend/.env` sudah benar sebelum menjalankan script:
- `DB_CONNECTION=mysql`
- `DB_HOST`, `DB_PORT`
- `DB_DATABASE=sklidn` (atau nama DB target Anda)
- `DB_USERNAME`, `DB_PASSWORD`

## 2) Konfigurasi Nginx

Gunakan contoh: `deploy/proxmox/nginx-skl.idnbogor.id.conf.example`

Lalu sesuaikan path server Anda:
- `/var/www/SKLIDN/frontend/dist`
- `/var/www/SKLIDN/backend/public`

## 3) SSL (Let's Encrypt)

Setelah Nginx aktif, jalankan certbot sesuai distro server Anda.

## Catatan penting

- Setup lokal tetap aman karena script tidak mengubah file env lokal yang sudah ada.
- Untuk update berikutnya, script bisa dijalankan ulang.
- Jika ingin ubah domain, cukup ubah `DOMAIN=...` saat menjalankan script.
