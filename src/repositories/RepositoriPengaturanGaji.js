const { PengaturanGaji, Pengguna } = require('../models');
const { Op } = require('sequelize');

const ATRIBUT_PENGGUNA = ['id', 'idPegawai', 'nama'];

class RepositoriPengaturanGaji {
  async cariSemua() {
    return PengaturanGaji.findAll({
      include: [
        { model: Pengguna, as: 'pembuat', attributes: ['id', 'nama'], required: false },
        { model: Pengguna, as: 'pegawai', attributes: ATRIBUT_PENGGUNA, required: false },
      ],
      order: [['berlakuMulai', 'DESC'], ['createdAt', 'DESC']],
    });
  }

  /** Cari pengaturan aktif: user-spesifik dulu, fallback ke global */
  async cariAktif(tanggal, idPengguna = null) {
    const tgl = tanggal || new Date().toISOString().split('T')[0];
    const kondisiDasar = { berlakuMulai: { [Op.lte]: tgl }, aktif: true };

    if (idPengguna) {
      const spesifik = await PengaturanGaji.findOne({
        where: { ...kondisiDasar, idPengguna },
        order: [['berlakuMulai', 'DESC']],
      });
      if (spesifik) return spesifik;
    }

    // Fallback: pengaturan global (idPengguna = null)
    return PengaturanGaji.findOne({
      where: { ...kondisiDasar, idPengguna: null },
      order: [['berlakuMulai', 'DESC']],
    });
  }

  async cariPerId(id) {
    return PengaturanGaji.findByPk(id, {
      include: [
        { model: Pengguna, as: 'pegawai', attributes: ATRIBUT_PENGGUNA, required: false },
      ],
    });
  }

  async buat(data) {
    return PengaturanGaji.create(data);
  }

  async perbarui(id, data) {
    await PengaturanGaji.update(data, { where: { id } });
    return this.cariPerId(id);
  }

  async hapus(id) {
    return PengaturanGaji.destroy({ where: { id } });
  }
}

module.exports = new RepositoriPengaturanGaji();
