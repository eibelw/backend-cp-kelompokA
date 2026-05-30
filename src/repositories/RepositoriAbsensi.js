const { Absensi, Pengguna } = require('../models');
const { Op } = require('sequelize');

// Atribut pengguna yang ditampilkan saat join dengan tabel absensi
const ATRIBUT_PENGGUNA = ['id', 'idPegawai', 'nama', 'departemen', 'jabatan'];

// Lapisan akses data untuk tabel absensi
class RepositoriAbsensi {
  async cariSemua({ halaman = 1, batas = 10, idPengguna, tanggal, tanggalMulai, tanggalSelesai, status } = {}) {
    const kondisi = {};
    if (idPengguna) kondisi.idPengguna = idPengguna;
    if (tanggal) kondisi.tanggal = tanggal;
    if (tanggalMulai && tanggalSelesai)
      kondisi.tanggal = { [Op.between]: [tanggalMulai, tanggalSelesai] };
    if (status) kondisi.status = status;

    const offset = (halaman - 1) * batas;
    const { count, rows } = await Absensi.findAndCountAll({
      where: kondisi,
      include: [{ model: Pengguna, as: 'pengguna', attributes: ATRIBUT_PENGGUNA }],
      limit: batas,
      offset,
      order: [['tanggal', 'DESC'], ['waktuMasuk', 'DESC']],
    });

    return { absensi: rows, total: count, halaman, totalHalaman: Math.ceil(count / batas) };
  }

  async cariPerId(id) {
    return Absensi.findByPk(id, {
      include: [{ model: Pengguna, as: 'pengguna', attributes: ATRIBUT_PENGGUNA }],
    });
  }

  async cariPerPenggunaDanTanggal(idPengguna, tanggal) {
    return Absensi.findOne({
      where: { idPengguna, tanggal },
      include: [{ model: Pengguna, as: 'pengguna', attributes: ATRIBUT_PENGGUNA }],
    });
  }

  async cariHariIniPerPengguna(idPengguna) {
    const hari = new Date().toISOString().split('T')[0];
    return this.cariPerPenggunaDanTanggal(idPengguna, hari);
  }

  // Ambil semua data untuk keperluan ekspor (tanpa paginasi)
  async ambilRekap({ tanggalMulai, tanggalSelesai, idPengguna, departemen } = {}) {
    const kondisi = {};
    if (tanggalMulai && tanggalSelesai)
      kondisi.tanggal = { [Op.between]: [tanggalMulai, tanggalSelesai] };
    if (idPengguna) kondisi.idPengguna = idPengguna;

    const kondisiPengguna = {};
    if (departemen) kondisiPengguna.departemen = departemen;

    return Absensi.findAll({
      where: kondisi,
      include: [{ model: Pengguna, as: 'pengguna', attributes: ATRIBUT_PENGGUNA, where: kondisiPengguna }],
      order: [['tanggal', 'ASC']],
    });
  }

  async buat(data) {
    return Absensi.create(data);
  }

  async perbarui(id, data) {
    const [, baris] = await Absensi.update(data, { where: { id }, returning: true });
    return baris[0] || null;
  }
}

module.exports = new RepositoriAbsensi();
