const jwt = require('jsonwebtoken');
const RepositoriPengguna = require('../repositories/RepositoriPengguna');
const { supabase, BUCKET } = require('../middlewares/unggah');

// Layanan otentikasi: login, refresh token, dan ubah kata sandi
class LayananOtentikasi {
  async masuk(email, kataSandi) {
    const pengguna = await RepositoriPengguna.cariPerEmail(email);
    if (!pengguna) throw { statusCode: 401, message: 'Email atau kata sandi salah' };
    if (!pengguna.aktif) throw { statusCode: 401, message: 'Akun tidak aktif, hubungi admin' };

    const valid = await pengguna.validasiKataSandi(kataSandi);
    if (!valid) throw { statusCode: 401, message: 'Email atau kata sandi salah' };

    const muatan = { id: pengguna.id, peran: pengguna.peran };
    const token = jwt.sign(muatan, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    });
    const tokenPembaruan = jwt.sign(muatan, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });

    return { token, tokenPembaruan, pengguna: pengguna.keJSONAman() };
  }

  async perbaruiToken(tokenPembaruan) {
    try {
      const terdekode = jwt.verify(tokenPembaruan, process.env.JWT_REFRESH_SECRET);
      const pengguna = await RepositoriPengguna.cariPerId(terdekode.id);
      if (!pengguna || !pengguna.aktif) throw new Error('Pengguna tidak valid');

      const token = jwt.sign(
        { id: pengguna.id, peran: pengguna.peran },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
      );
      return { token };
    } catch {
      throw { statusCode: 401, message: 'Token pembaruan tidak valid atau sudah kedaluwarsa' };
    }
  }

  async ubahKataSandi(idPengguna, kataSandiLama, kataSandiBaru) {
    const pengguna = await RepositoriPengguna.cariPerIdDenganKataSandi(idPengguna);
    if (!pengguna) throw { statusCode: 404, message: 'Pengguna tidak ditemukan' };

    const valid = await pengguna.validasiKataSandi(kataSandiLama);
    if (!valid) throw { statusCode: 400, message: 'Kata sandi lama salah' };

    pengguna.kataSandi = kataSandiBaru;
    await pengguna.save();
  }

  ambilProfil(pengguna) {
    const { kataSandi, ...aman } = pengguna.dataValues || pengguna;
    return aman;
  }

  async unggahFotoProfil(idPengguna, fileFoto) {
    if (!fileFoto) throw { statusCode: 400, message: 'File foto wajib diunggah' };

    const pengguna = await RepositoriPengguna.cariPerIdDenganKataSandi(idPengguna);
    if (!pengguna) throw { statusCode: 404, message: 'Pengguna tidak ditemukan' };

    // Hapus foto lama dari Supabase jika ada
    if (pengguna.urlFoto) {
      const jalurLama = new URL(pengguna.urlFoto).pathname
        .split(`/storage/v1/object/public/${BUCKET}/`)[1];
      if (jalurLama) await supabase.storage.from(BUCKET).remove([jalurLama]);
    }

    const urlFoto = fileFoto.supabaseUrl;
    await RepositoriPengguna.perbarui(idPengguna, { urlFoto });
    return { urlFoto };
  }
}

module.exports = new LayananOtentikasi();
