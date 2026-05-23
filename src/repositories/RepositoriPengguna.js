const { Pengguna } = require('../models');
const { Op } = require('sequelize');

// Lapisan akses data untuk tabel pengguna
class RepositoriPengguna {
  async cariSemua({ halaman = 1, batas = 10, cari, departemen, peran, aktif } = {}) {
    const kondisi = {};

    if (cari) {
      kondisi[Op.or] = [
        { nama: { [Op.like]: `%${cari}%` } },
        { email: { [Op.like]: `%${cari}%` } },
        { idPegawai: { [Op.like]: `%${cari}%` } },
      ];
    }
    if (departemen) kondisi.departemen = departemen;
    if (peran) kondisi.peran = peran;
    if (aktif !== undefined) kondisi.aktif = aktif;

    const offset = (halaman - 1) * batas;
    const { count, rows } = await Pengguna.findAndCountAll({
      where: kondisi,
      attributes: { exclude: ['kataSandi'] },
      limit: batas,
      offset,
      order: [['nama', 'ASC']],
    });

    return { pengguna: rows, total: count, halaman, totalHalaman: Math.ceil(count / batas) };
  }

  async cariPerId(id) {
    return Pengguna.findByPk(id, { attributes: { exclude: ['kataSandi'] } });
  }

  async cariPerIdDenganKataSandi(id) {
    return Pengguna.findByPk(id);
  }

  async cariPerEmail(email) {
    return Pengguna.findOne({ where: { email } });
  }

  async cariPerIdPegawai(idPegawai) {
    return Pengguna.findOne({
      where: { idPegawai },
      attributes: { exclude: ['kataSandi'] },
    });
  }

  async buat(data) {
    return Pengguna.create(data);
  }

  async perbarui(id, data) {
    await Pengguna.update(data, { where: { id } });
    return Pengguna.findByPk(id, { attributes: { exclude: ['kataSandi'] } });
  }

  async hapus(id) {
    return Pengguna.destroy({ where: { id } });
  }

  async nonaktifkan(id) {
    return Pengguna.update({ aktif: false }, { where: { id } });
  }

  async idBerikutnyaUntukLokasi(kode) {
    const prefix = `${kode}_`;
    const hasil = await Pengguna.findAll({
      where: { idPegawai: { [Op.like]: `${prefix}%` } },
      attributes: ['idPegawai'],
      order: [['idPegawai', 'DESC']],
      limit: 1,
    });
    if (hasil.length === 0) return `${prefix}001`;
    const terakhir = hasil[0].idPegawai;
    const nomorStr = terakhir.substring(prefix.length);
    const nomor = parseInt(nomorStr, 10) || 0;
    const berikutnya = nomor + 1;
    if (berikutnya > 999) throw { statusCode: 400, message: `Batas ID pegawai untuk lokasi ${kode} sudah penuh (maks 999)` };
    return `${prefix}${String(berikutnya).padStart(3, '0')}`;
  }
}

module.exports = new RepositoriPengguna();
