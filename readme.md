# Backend Capstone Project Kelompok A

## Struktur Proyek

```
backend/
├── .env / .env.example            ← Konfigurasi
├── uploads/photos/ & documents/   ← Storage foto & surat
└── src/
    ├── config/
    ├── entities/
    ├── models/
    ├── repositories/
    ├── services/
    ├── controllers/
    ├── routes/
    ├── middlewares/
    ├── utils/
    └── database/
```

# API Endpoint

## Auth

| Method | Path                          | Keterangan               |
| ------ | ----------------------------- | ------------------------ |
| `POST` | `/otentikasi/masuk`           | Login user               |
| `POST` | `/otentikasi/keluar`          | Logout user              |
| `POST` | `/otentikasi/perbarui-token`  | Refresh JWT token        |
| `GET`  | `/otentikasi/profil`          | Get profil user saat ini |
| `PUT`  | `/otentikasi/ubah-kata-sandi` | Ganti password           |

---

## Absensi

| Method | Path                | Keterangan                     |
| ------ | ------------------- | ------------------------------ |
| `POST` | `/absensi/masuk`    | Check-in (+ foto upload + GPS) |
| `PUT`  | `/absensi/keluar`   | Check-out                      |
| `GET`  | `/absensi/hari-ini` | Data absensi hari ini          |
| `GET`  | `/absensi/riwayat`  | Riwayat absensi                |

---

## Izin

| Method   | Path        | Keterangan                 |
| -------- | ----------- | -------------------------- |
| `POST`   | `/izin`     | Buat pengajuan izin        |
| `GET`    | `/izin`     | List semua izin milik user |
| `GET`    | `/izin/:id` | Detail izin berdasarkan ID |
| `DELETE` | `/izin/:id` | Hapus pengajuan izin       |

---

## Admin

| Method                         | Path                  | Keterangan              |
| ------------------------------ | --------------------- | ----------------------- |
| `GET \| POST \| PUT \| DELETE` | `/admin/pengguna`     | CRUD data user          |
| `GET \| POST \| PUT \| DELETE` | `/admin/absensi`      | CRUD data absensi       |
| `GET \| POST \| PUT \| DELETE` | `/admin/izin`         | CRUD data izin          |
| `GET`                          | `/admin/ekspor/excel` | Export laporan ke Excel |
| `GET`                          | `/admin/ekspor/pdf`   | Export laporan ke PDF   |
| `GET \| POST \| PUT \| DELETE` | `/admin/lokasi`       | CRUD lokasi GPS kantor  |

## Ping

| Method | Path    | Keterangan      |
| ------ | ------- | --------------- |
| `GET`  | `/ping` | Ping status api |

### Ringkasa

> **Total:** 5 grup · 19 path

---

# Cara Menjalankan

1. Isi .env — ganti `DB_PASSWORD` dengan password PostgreSQL
2. Buat database: `CREATE DATABASE capstone_kelompok_A;` PostgreSQL
3. Jalankan migrasi: `node src/database/migrate.js`
4. Seed data awal: `node src/database/seed.js`
5. Jalankan server: `npm run dev`

---

> Login default setelah seed:
>
> - Admin: admin@perusahaan.com / admin123
