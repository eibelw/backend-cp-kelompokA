const { validationResult } = require('express-validator');
const ResponAPI = require('../utils/ResponAPI');

// Periksa hasil validasi dari express-validator dan kembalikan error jika ada
function validasi(req, res, berikutnya) {
  const hasil = validationResult(req);
  if (!hasil.isEmpty()) {
    return ResponAPI.permintaanTidakValid(
      res,
      'Validasi gagal',
      hasil.array().map((e) => e.msg)
    );
  }
  berikutnya();
}

module.exports = { validasi };
