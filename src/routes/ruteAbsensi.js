const router = require('express').Router();
const { body } = require('express-validator');
const KontrolerAbsensi = require('../controllers/KontrolerAbsensi');
const { autentikasi } = require('../middlewares/otentikasi');
const { unggahFoto } = require('../middlewares/unggah');
const { validasi } = require('../middlewares/validasi');

// Semua rute absensi memerlukan token yang valid
router.use(autentikasi);

// POST /api/v1/absensi/masuk — Absen masuk dengan foto selfie dan koordinat GPS
router.post(
  '/masuk',
  unggahFoto.single('foto'),
  [
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude tidak valid'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude tidak valid'),
  ],
  validasi,
  KontrolerAbsensi.masukAbsen
);

// PUT /api/v1/absensi/keluar — Absen keluar dengan koordinat GPS
router.put(
  '/keluar',
  [
    body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude tidak valid'),
    body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude tidak valid'),
  ],
  validasi,
  KontrolerAbsensi.keluarAbsen
);

// GET /api/v1/absensi/hari-ini — Ambil data absensi hari ini
router.get('/hari-ini', KontrolerAbsensi.ambilHariIni);

// GET /api/v1/absensi/riwayat — Ambil riwayat absensi dengan filter dan paginasi
router.get('/riwayat', KontrolerAbsensi.ambilRiwayat);

// GET /api/v1/absensi/:id — Ambil detail absensi berdasarkan ID
router.get('/:id', KontrolerAbsensi.ambilPerId);

module.exports = router;
