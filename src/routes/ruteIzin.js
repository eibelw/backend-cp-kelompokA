const router = require('express').Router();
const { body } = require('express-validator');
const KontrolerIzin = require('../controllers/KontrolerIzin');
const { autentikasi } = require('../middlewares/otentikasi');
const { unggahDokumen } = require('../middlewares/unggah');
const { validasi } = require('../middlewares/validasi');

// Semua rute izin memerlukan token yang valid
router.use(autentikasi);

// POST /api/v1/izin — Ajukan permohonan izin atau sakit
router.post(
  '/',
  unggahDokumen.single('dokumen'),
  [
    body('jenisIzin').isIn(['izin', 'sakit']).withMessage('Jenis izin harus: izin atau sakit'),
    body('tanggalMulai').isDate().withMessage('Tanggal mulai tidak valid'),
    body('tanggalSelesai').isDate().withMessage('Tanggal selesai tidak valid'),
    body('alasan').notEmpty().withMessage('Alasan wajib diisi'),
  ],
  validasi,
  KontrolerIzin.ajukanIzin
);

// GET /api/v1/izin — Ambil daftar izin milik pengguna yang sedang login
router.get('/', KontrolerIzin.ambilIzinSaya);

// GET /api/v1/izin/:id — Ambil detail pengajuan izin
router.get('/:id', KontrolerIzin.ambilPerId);

// DELETE /api/v1/izin/:id — Batalkan pengajuan izin (hanya status menunggu)
router.delete('/:id', KontrolerIzin.batalIzin);

module.exports = router;
