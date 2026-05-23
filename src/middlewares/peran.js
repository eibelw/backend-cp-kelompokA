const ResponAPI = require('../utils/ResponAPI');

// Batasi akses berdasarkan peran pengguna (admin / pegawai)
function otorisasi(...peranDiizinkan) {
  return (req, res, berikutnya) => {
    if (!req.pengguna) return ResponAPI.tidakTerotorisasi(res);
    if (!peranDiizinkan.includes(req.pengguna.peran)) {
      return ResponAPI.aksesditolak(res, 'Anda tidak memiliki hak akses ke halaman ini');
    }
    berikutnya();
  };
}

module.exports = { otorisasi };
