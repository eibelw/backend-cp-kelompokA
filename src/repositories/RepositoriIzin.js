const { Izin, Pengguna } = require('../models');
const { Op } = require('sequelize');

const ATRIBUT_PENGGUNA = ['id', 'idPegawai', 'nama', 'departemen', 'jabatan'];

// Lapisan akses data untuk tabel izin_sakit
class RepositoriIzin {
  async cariSemua({ halaman = 1, batas = 10, idPengguna, status, jenisIzin, tanggalMulai, tanggalSelesai } = {}) {
    const kondisi = {};
    if (idPengguna) kondisi.idPengguna = idPengguna;
    if (status) kondisi.status = status;
    if (jenisIzin) kondisi.jenisIzin = jenisIzin;
    if (tanggalMulai && tanggalSelesai) {
      kondisi[Op.or] = [
        { tanggalMulai: { [Op.between]: [tanggalMulai, tanggalSelesai] } },
        { tanggalSelesai: { [Op.between]: [tanggalMulai, tanggalSelesai] } },
      ];
    }

    const offset = (halaman - 1) * batas;
    const { count, rows } = await Izin.findAndCountAll({
      where: kondisi,
      include: [
        { model: Pengguna, as: 'pengguna', attributes: ATRIBUT_PENGGUNA },
        { model: Pengguna, as: 'penyetuju', attributes: ['id', 'nama'], required: false },
      ],
      limit: batas,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return { izin: rows, total: count, halaman, totalHalaman: Math.ceil(count / batas) };
  }

  async cariPerId(id) {
    return Izin.findByPk(id, {
      include: [
        { model: Pengguna, as: 'pengguna', attributes: ATRIBUT_PENGGUNA },
        { model: Pengguna, as: 'penyetuju', attributes: ['id', 'nama'], required: false },
      ],
    });
  }

  async cariIzinAktifPerPengguna(idPengguna, tanggal) {
    return Izin.findOne({
      where: {
        idPengguna,
        status: 'disetujui',
        tanggalMulai: { [Op.lte]: tanggal },
        tanggalSelesai: { [Op.gte]: tanggal },
      },
    });
  }

  async buat(data) {
    return Izin.create(data);
  }

  async perbarui(id, data) {
    await Izin.update(data, { where: { id } });
    return this.cariPerId(id);
  }

  async hapus(id) {
    return Izin.destroy({ where: { id } });
  }
}

module.exports = new RepositoriIzin();
