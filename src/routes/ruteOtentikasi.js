const router = require('express').Router();
const { body } = require('express-validator');
const KontrolerOtentikasi = require('../controllers/KontrolerOtentikasi');
const { autentikasi } = require('../middlewares/otentikasi');
const { validasi } = require('../middlewares/validasi');
const { unggahFoto } = require('../middlewares/unggah');

// POST /api/v1/otentikasi/masuk — Login pegawai atau admin
router.post(
  '/masuk',
  [
    body('email').isEmail().withMessage('Format email tidak valid'),
    body('kataSandi').notEmpty().withMessage('Kata sandi wajib diisi'),
  ],
  validasi,
  KontrolerOtentikasi.masuk
);

// POST /api/v1/otentikasi/keluar — Logout (token dihapus di sisi klien)
router.post('/keluar', autentikasi, KontrolerOtentikasi.keluar);

// GET /api/v1/otentikasi/profil — Ambil data profil pengguna yang sedang login
router.get('/profil', autentikasi, KontrolerOtentikasi.ambilProfil);

// POST /api/v1/otentikasi/perbarui-token — Perbarui access token menggunakan refresh token
router.post(
  '/perbarui-token',
  [body('tokenPembaruan').notEmpty().withMessage('Token pembaruan wajib diisi')],
  validasi,
  KontrolerOtentikasi.perbaruiToken
);

// PUT /api/v1/otentikasi/profil/foto — Unggah foto profil pengguna
router.put('/profil/foto', autentikasi, unggahFoto, KontrolerOtentikasi.unggahFotoProfil);

// PUT /api/v1/otentikasi/ubah-kata-sandi — Ubah kata sandi pengguna
router.put(
  '/ubah-kata-sandi',
  autentikasi,
  [
    body('kataSandiLama').notEmpty().withMessage('Kata sandi lama wajib diisi'),
    body('kataSandiBaru')
      .isLength({ min: 6 })
      .withMessage('Kata sandi baru minimal 6 karakter'),
  ],
  validasi,
  KontrolerOtentikasi.ubahKataSandi
);

module.exports = router;
