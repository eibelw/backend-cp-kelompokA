const LayananOtentikasi = require('../services/LayananOtentikasi');
const ResponAPI = require('../utils/ResponAPI');

// Kontroler otentikasi: menangani permintaan HTTP untuk login, logout, profil
class KontrolerOtentikasi {
  async masuk(req, res, berikutnya) {
    try {
      const { email, kataSandi } = req.body;
      const hasil = await LayananOtentikasi.masuk(email, kataSandi);
      return ResponAPI.berhasil(res, hasil, 'Login berhasil');
    } catch (err) {
      berikutnya(err);
    }
  }

  async keluar(req, res) {
    // Logout ditangani di sisi klien dengan menghapus token
    return ResponAPI.berhasil(res, null, 'Logout berhasil');
  }

  async ambilProfil(req, res, berikutnya) {
    try {
      const profil = LayananOtentikasi.ambilProfil(req.pengguna);
      return ResponAPI.berhasil(res, profil, 'Profil berhasil diambil');
    } catch (err) {
      berikutnya(err);
    }
  }

  async perbaruiToken(req, res, berikutnya) {
    try {
      const { tokenPembaruan } = req.body;
      const hasil = await LayananOtentikasi.perbaruiToken(tokenPembaruan);
      return ResponAPI.berhasil(res, hasil, 'Token berhasil diperbarui');
    } catch (err) {
      berikutnya(err);
    }
  }

  async ubahKataSandi(req, res, berikutnya) {
    try {
      const { kataSandiLama, kataSandiBaru } = req.body;
      await LayananOtentikasi.ubahKataSandi(req.pengguna.id, kataSandiLama, kataSandiBaru);
      return ResponAPI.berhasil(res, null, 'Kata sandi berhasil diubah');
    } catch (err) {
      berikutnya(err);
    }
  }

  async unggahFotoProfil(req, res, berikutnya) {
    try {
      const hasil = await LayananOtentikasi.unggahFotoProfil(req.pengguna.id, req.file);
      return ResponAPI.berhasil(res, hasil, 'Foto profil berhasil diperbarui');
    } catch (err) {
      berikutnya(err);
    }
  }
}

module.exports = new KontrolerOtentikasi();
