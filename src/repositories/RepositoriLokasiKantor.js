const { LokasiKantor } = require('../models');

// Lapisan akses data untuk tabel lokasi_kantor
class RepositoriLokasiKantor {
  async cariSemua() {
    return LokasiKantor.findAll({ order: [['nama', 'ASC']] });
  }

  // Hanya lokasi yang aktif digunakan untuk validasi GPS absensi
  async cariYangAktif() {
    return LokasiKantor.findAll({ where: { aktif: true } });
  }

  async cariPerId(id) {
    return LokasiKantor.findByPk(id);
  }

  async cariPerKode(kode) {
    return LokasiKantor.findOne({ where: { kode } });
  }

  async buat(data) {
    return LokasiKantor.create(data);
  }

  async perbarui(id, data) {
    const [, baris] = await LokasiKantor.update(data, { where: { id }, returning: true });
    return baris[0] || null;
  }

  async hapus(id) {
    return LokasiKantor.destroy({ where: { id } });
  }
}

module.exports = new RepositoriLokasiKantor();
