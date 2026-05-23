const router = require('express').Router();
const KontrolerGaji = require('../controllers/KontrolerGaji');
const { autentikasi } = require('../middlewares/otentikasi');

// GET /api/v1/gaji/slip — Riwayat slip gaji milik pengguna yang login
router.get('/slip', autentikasi, KontrolerGaji.ambilSlipSaya);

module.exports = router;
