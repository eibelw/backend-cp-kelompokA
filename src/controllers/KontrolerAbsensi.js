const LayananAbsensi = require('../services/LayananAbsensi');
const ResponAPI = require('../utils/ResponAPI');

// Kontroler absensi: menangani permintaan HTTP absen masuk dan keluar
class KontrolerAbsensi {
  async masukAbsen(req, res, berikutnya) {
    try {
      const { latitude, longitude } = req.body;
      const absensi = await LayananAbsensi.masukAbsen(req.pengguna.id, {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        fileFoto: req.file,
      });
      return ResponAPI.dibuatBerhasil(res, absensi, 'Absen masuk berhasil');
    } catch (err) {
      berikutnya(err);
    }
  }

  async keluarAbsen(req, res, berikutnya) {
    try {
      const { latitude, longitude } = req.body;
      const absensi = await LayananAbsensi.keluarAbsen(req.pengguna.id, {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      });
      return ResponAPI.berhasil(res, absensi, 'Absen keluar berhasil');
    } catch (err) {
      berikutnya(err);
    }
  }

  async ambilHariIni(req, res, berikutnya) {
    try {
      const absensi = await LayananAbsensi.ambilHariIni(req.pengguna.id);
      return ResponAPI.berhasil(res, absensi, 'Data absensi hari ini');
    } catch (err) {
      berikutnya(err);
    }
  }

  async ambilRiwayat(req, res, berikutnya) {
    try {
      const { halaman, batas, tanggalMulai, tanggalSelesai, status } = req.query;
      const hasil = await LayananAbsensi.ambilRiwayat(req.pengguna.id, {
        halaman: parseInt(halaman) || 1,
        batas: parseInt(batas) || 10,
        tanggalMulai,
        tanggalSelesai,
        status,
      });
      return ResponAPI.berhasilDenganPaginasi(
        res,
        { data: hasil.absensi, ...hasil },
        'Riwayat absensi'
      );
    } catch (err) {
      berikutnya(err);
    }
  }

  async ambilPerId(req, res, berikutnya) {
    try {
      const absensi = await LayananAbsensi.ambilPerId(req.params.id);
      return ResponAPI.berhasil(res, absensi);
    } catch (err) {
      berikutnya(err);
    }
  }
}

module.exports = new KontrolerAbsensi();
