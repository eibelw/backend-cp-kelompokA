const LayananIzin = require('../services/LayananIzin');
const ResponAPI = require('../utils/ResponAPI');

// Kontroler izin/sakit: menangani pengajuan, daftar, dan pembatalan izin pegawai
class KontrolerIzin {
  async ajukanIzin(req, res, berikutnya) {
    try {
      const izin = await LayananIzin.ajukanIzin(req.pengguna.id, {
        ...req.body,
        fileDokumen: req.file,
      });
      return ResponAPI.dibuatBerhasil(res, izin, 'Pengajuan izin berhasil dikirim');
    } catch (err) {
      berikutnya(err);
    }
  }

  async ambilIzinSaya(req, res, berikutnya) {
    try {
      const { halaman, batas, status, jenisIzin } = req.query;
      const hasil = await LayananIzin.ambilIzinSaya(req.pengguna.id, {
        halaman: parseInt(halaman) || 1,
        batas: parseInt(batas) || 10,
        status,
        jenisIzin,
      });
      return ResponAPI.berhasilDenganPaginasi(
        res,
        { data: hasil.izin, ...hasil },
        'Daftar pengajuan izin'
      );
    } catch (err) {
      berikutnya(err);
    }
  }

  async ambilPerId(req, res, berikutnya) {
    try {
      const izin = await LayananIzin.ambilPerId(req.params.id, req.pengguna.id);
      return ResponAPI.berhasil(res, izin);
    } catch (err) {
      berikutnya(err);
    }
  }

  async batalIzin(req, res, berikutnya) {
    try {
      await LayananIzin.batalIzin(req.params.id, req.pengguna.id);
      return ResponAPI.berhasil(res, null, 'Pengajuan izin berhasil dibatalkan');
    } catch (err) {
      berikutnya(err);
    }
  }
}

module.exports = new KontrolerIzin();
