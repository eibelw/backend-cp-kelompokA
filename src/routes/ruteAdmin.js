const router = require('express').Router();
const { body } = require('express-validator');
const KontrolerAdmin = require('../controllers/KontrolerAdmin');
const KontrolerGaji = require('../controllers/KontrolerGaji');
const { autentikasi } = require('../middlewares/otentikasi');
const { otorisasi } = require('../middlewares/peran');
const { validasi } = require('../middlewares/validasi');

// Semua rute admin memerlukan token valid dan peran 'admin'
router.use(autentikasi, otorisasi('admin'));

////  Manajemen Pengguna
// GET  /api/v1/admin/pengguna           — Daftar semua pegawai (dengan filter & paginasi)
// GET  /api/v1/admin/pengguna/:id       — Detail pegawai
// POST /api/v1/admin/pengguna           — Tambah pegawai baru
// PUT  /api/v1/admin/pengguna/:id       — Perbarui data pegawai
// DELETE /api/v1/admin/pengguna/:id     — Nonaktifkan akun pegawai
router.get('/pengguna', KontrolerAdmin.ambilPengguna);
router.get('/pengguna/id-berikutnya', KontrolerAdmin.prakiraIdPegawai);
router.get('/pengguna/:id', KontrolerAdmin.ambilPenggunaPerId);
router.post(
  '/pengguna',
  [
    body('idLokasiKantor').notEmpty().withMessage('Lokasi kantor wajib dipilih'),
    body('nama').notEmpty().withMessage('Nama wajib diisi'),
    body('email').isEmail().withMessage('Format email tidak valid'),
    body('kataSandi').isLength({ min: 6 }).withMessage('Kata sandi minimal 6 karakter'),
    body('peran').isIn(['admin', 'pegawai']).withMessage('Peran harus: admin atau pegawai'),
  ],
  validasi,
  KontrolerAdmin.buatPengguna
);
router.put('/pengguna/:id', KontrolerAdmin.perbaruiPengguna);
router.put(
  '/pengguna/:id/kata-sandi',
  [body('kataSandiBaru').isLength({ min: 6 }).withMessage('Kata sandi minimal 6 karakter')],
  validasi,
  KontrolerAdmin.ubahKataSandiPengguna
);
router.delete('/pengguna/:id/foto', KontrolerAdmin.hapusFotoPengguna);
router.delete('/pengguna/:id', KontrolerAdmin.hapusPengguna);

//// Rekap Absensi 
// GET /api/v1/admin/absensi             — Rekap absensi (filter: idPengguna, tanggal, status)
// GET /api/v1/admin/absensi/:id         — Detail satu record absensi
// PUT /api/v1/admin/absensi/:id         — Koreksi data absensi secara manual
router.get('/absensi', KontrolerAdmin.ambilAbsensi);
router.get('/absensi/:id', KontrolerAdmin.ambilAbsensiPerId);
router.put('/absensi/:id', KontrolerAdmin.perbaruiAbsensi);

//// Manajemen Izin 
// GET /api/v1/admin/izin                — Semua pengajuan izin (filter: status, idPengguna)
// PUT /api/v1/admin/izin/:id/setujui    — Setujui pengajuan izin
// PUT /api/v1/admin/izin/:id/tolak      — Tolak pengajuan izin
router.get('/izin', KontrolerAdmin.ambilSemuaIzin);
router.put('/izin/:id/setujui', KontrolerAdmin.setujuiIzin);
router.put('/izin/:id/tolak', KontrolerAdmin.tolakIzin);

//// Ekspor Data
// GET /api/v1/admin/ekspor/excel        — Unduh rekap absensi format Excel
// GET /api/v1/admin/ekspor/pdf          — Unduh rekap absensi format PDF
router.get('/ekspor/excel', KontrolerAdmin.eksporExcel);
router.get('/ekspor/pdf', KontrolerAdmin.eksporPDF);

//// Lokasi Kantor
// GET    /api/v1/admin/lokasi           — Daftar semua lokasi kantor
// POST   /api/v1/admin/lokasi           — Tambah lokasi kantor baru
// PUT    /api/v1/admin/lokasi/:id       — Perbarui lokasi kantor
// DELETE /api/v1/admin/lokasi/:id       — Hapus lokasi kantor
router.get('/lokasi', KontrolerAdmin.ambilLokasi);
router.post(
  '/lokasi',
  [
    body('kode')
      .notEmpty().withMessage('Kode lokasi wajib diisi')
      .isAlphanumeric().withMessage('Kode hanya boleh huruf dan angka')
      .isLength({ max: 10 }).withMessage('Kode maksimal 10 karakter')
      .toUpperCase(),
    body('nama').notEmpty().withMessage('Nama lokasi wajib diisi'),
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude tidak valid'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude tidak valid'),
    body('radius').isInt({ min: 10 }).withMessage('Radius minimal 10 meter'),
  ],
  validasi,
  KontrolerAdmin.buatLokasi
);
router.put('/lokasi/:id', KontrolerAdmin.perbaruiLokasi);
router.delete('/lokasi/:id', KontrolerAdmin.hapusLokasi);

//// Manajemen Gaji
// GET    /api/v1/admin/gaji/pengaturan         — Daftar semua pengaturan gaji
// POST   /api/v1/admin/gaji/pengaturan         — Tambah pengaturan gaji baru
// PUT    /api/v1/admin/gaji/pengaturan/:id     — Perbarui pengaturan gaji
// POST   /api/v1/admin/gaji/slip/generate      — Generate slip gaji bulanan
// GET    /api/v1/admin/gaji/slip               — Daftar semua slip gaji
// GET    /api/v1/admin/gaji/slip/:id           — Detail slip gaji
router.get('/gaji/pengaturan', KontrolerGaji.ambilPengaturan);
router.post(
  '/gaji/pengaturan',
  [
    body('gajiPokok').isFloat({ min: 0 }).withMessage('Gaji pokok harus berupa angka positif'),
    body('berlakuMulai').isDate().withMessage('Tanggal berlaku tidak valid'),
  ],
  validasi,
  KontrolerGaji.buatPengaturan
);
router.put('/gaji/pengaturan/:id', KontrolerGaji.perbaruiPengaturan);
router.delete('/gaji/pengaturan/:id', KontrolerGaji.hapusPengaturan);
router.get('/gaji/jadwal', KontrolerGaji.ambilJadwal);
router.post('/gaji/jadwal', KontrolerGaji.simpanJadwal);
router.post('/gaji/slip/generate', KontrolerGaji.generateSlip);
router.get('/gaji/slip', KontrolerGaji.ambilSemuaSlip);
router.get('/gaji/slip/:id', KontrolerGaji.ambilSlipPerId);

module.exports = router;
