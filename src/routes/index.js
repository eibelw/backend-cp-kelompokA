// Titik masuk utama semua rute API versi 1
const router = require('express').Router();

const ruteOtentikasi = require('./ruteOtentikasi');
const ruteAbsensi = require('./ruteAbsensi');
const ruteIzin = require('./ruteIzin');
const ruteAdmin = require('./ruteAdmin');
const ruteGaji = require('./ruteGaji');

router.use('/otentikasi', ruteOtentikasi);
router.use('/absensi', ruteAbsensi);
router.use('/izin', ruteIzin);
router.use('/admin', ruteAdmin);
router.use('/gaji', ruteGaji);

// GET /api/v1/ping — Cek status koneksi server dan database
router.get('/ping', async (req, res) => {
  try {
    const { basisData } = require('../models');
    await basisData.authenticate();
    return res.status(200).json({
      success: true,
      status: 200,
      message: 'Server dan database terhubung',
      data: { database: 'terhubung', waktu: new Date().toISOString() },
    });
  } catch (kesalahan) {
    return res.status(503).json({
      success: false,
      status: 503,
      message: 'Gagal terhubung ke database',
      errorMessage: kesalahan.message,
      data: { database: 'terputus', waktu: new Date().toISOString() },
    });
  }
});

module.exports = router;
