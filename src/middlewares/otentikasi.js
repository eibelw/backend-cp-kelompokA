const jwt = require('jsonwebtoken');
const ResponAPI = require('../utils/ResponAPI');
const { Pengguna } = require('../models');

// Verifikasi token JWT dan lampirkan data pengguna ke req.pengguna
async function autentikasi(req, res, berikutnya) {
  const headerOtorisasi = req.headers.authorization;

  if (!headerOtorisasi || !headerOtorisasi.startsWith('Bearer ')) {
    return ResponAPI.tidakTerotorisasi(res, 'Token tidak ditemukan');
  }

  const token = headerOtorisasi.split(' ')[1];

  try {
    const terdekode = jwt.verify(token, process.env.JWT_SECRET);
    const pengguna = await Pengguna.findByPk(terdekode.id, {
      attributes: { exclude: ['kataSandi'] },
    });

    if (!pengguna) return ResponAPI.tidakTerotorisasi(res, 'Pengguna tidak ditemukan');
    if (!pengguna.aktif) return ResponAPI.tidakTerotorisasi(res, 'Akun tidak aktif, hubungi admin');

    req.pengguna = pengguna;
    berikutnya();
  } catch (kesalahan) {
    if (kesalahan.name === 'TokenExpiredError') {
      return ResponAPI.tidakTerotorisasi(res, 'Token sudah kedaluwarsa');
    }
    return ResponAPI.tidakTerotorisasi(res, 'Token tidak valid');
  }
}

module.exports = { autentikasi };
