const { SlipGaji, Pengguna } = require('../models');
const { Op } = require('sequelize');

const ATRIBUT_PENGGUNA = ['id', 'idPegawai', 'nama', 'departemen', 'jabatan'];

class RepositoriSlipGaji {
  async cariSemua({ halaman = 1, batas = 10, bulan, tahun, idPengguna, status } = {}) {
    const kondisi = {};
    if (bulan) kondisi.bulan = bulan;
    if (tahun) kondisi.tahun = tahun;
    if (idPengguna) kondisi.idPengguna = idPengguna;
    if (status) kondisi.status = status;

    const offset = (halaman - 1) * batas;
    const { count, rows } = await SlipGaji.findAndCountAll({
      where: kondisi,
      include: [{ model: Pengguna, as: 'pengguna', attributes: ATRIBUT_PENGGUNA }],
      limit: batas,
      offset,
      order: [['tahun', 'DESC'], ['bulan', 'DESC'], ['createdAt', 'DESC']],
    });

    return { slip: rows, total: count, halaman, totalHalaman: Math.ceil(count / batas) };
  }

  async cariPerId(id) {
    return SlipGaji.findByPk(id, {
      include: [{ model: Pengguna, as: 'pengguna', attributes: ATRIBUT_PENGGUNA }],
    });
  }

  async cariPerPenggunaBulanTahun(idPengguna, bulan, tahun) {
    return SlipGaji.findOne({
      where: { idPengguna, bulan, tahun },
      include: [{ model: Pengguna, as: 'pengguna', attributes: ATRIBUT_PENGGUNA }],
    });
  }

  async cariSemuaPerPengguna(idPengguna) {
    return SlipGaji.findAll({
      where: { idPengguna },
      order: [['tahun', 'DESC'], ['bulan', 'DESC']],
    });
  }

  async buat(data) {
    return SlipGaji.create(data);
  }

  async buatAtauPerbarui(data) {
    const { idPengguna, bulan, tahun, ...sisaData } = data;
    const [slip] = await SlipGaji.upsert({ idPengguna, bulan, tahun, ...sisaData });
    return slip;
  }

  async perbarui(id, data) {
    await SlipGaji.update(data, { where: { id } });
    return this.cariPerId(id);
  }
}

module.exports = new RepositoriSlipGaji();
