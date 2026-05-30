const { Absensi, Izin, Pengguna, JadwalKirimGaji } = require('../models');
const { Op } = require('sequelize');
const RepositoriPengaturanGaji = require('../repositories/RepositoriPengaturanGaji');
const RepositoriSlipGaji = require('../repositories/RepositoriSlipGaji');

class LayananGaji {
  // ─── Pengaturan Gaji ────────────────────────────────────────────────────────

  async ambilSemuaPengaturan() {
    return RepositoriPengaturanGaji.cariSemua();
  }

  async buatPengaturan(data, idAdmin) {
    return RepositoriPengaturanGaji.buat({ ...data, dibuatOleh: idAdmin });
  }

  async perbaruiPengaturan(id, data) {
    const pengaturan = await RepositoriPengaturanGaji.cariPerId(id);
    if (!pengaturan) throw { statusCode: 404, message: 'Pengaturan gaji tidak ditemukan' };
    return RepositoriPengaturanGaji.perbarui(id, data);
  }

  async hapusPengaturan(id) {
    const pengaturan = await RepositoriPengaturanGaji.cariPerId(id);
    if (!pengaturan) throw { statusCode: 404, message: 'Pengaturan gaji tidak ditemukan' };
    return RepositoriPengaturanGaji.hapus(id);
  }

  // ─── Generate Slip Gaji ─────────────────────────────────────────────────────

  async generateSlipBulan(bulan, tahun, idAdmin, idPengguna = null) {
    const awalBulan = `${tahun}-${String(bulan).padStart(2, '0')}-01`;
    const akhirBulan = new Date(tahun, bulan, 0).toISOString().split('T')[0];

    const kondisiPengguna = { aktif: true, peran: 'pegawai' };
    if (idPengguna) kondisiPengguna.id = idPengguna;

    const daftarPengguna = await Pengguna.findAll({
      where: kondisiPengguna,
      attributes: ['id'],
    });

    const hasilSlip = [];
    for (const pengguna of daftarPengguna) {
      // Cari pengaturan spesifik user dulu, fallback global
      const pengaturan = await RepositoriPengaturanGaji.cariAktif(awalBulan, pengguna.id);
      if (!pengaturan) continue; // skip jika tidak ada pengaturan sama sekali

      const slip = await this._hitungSlipPegawai(
        pengguna.id, bulan, tahun, awalBulan, akhirBulan, pengaturan, idAdmin
      );
      hasilSlip.push(slip);
    }

    return hasilSlip;
  }

  async _hitungSlipPegawai(idPengguna, bulan, tahun, awalBulan, akhirBulan, pengaturan, idAdmin) {
    const daftarAbsensi = await Absensi.findAll({
      where: { idPengguna, tanggal: { [Op.between]: [awalBulan, akhirBulan] }, status: 'hadir' },
      attributes: ['keterlambatan'],
    });

    const jumlahHadir = daftarAbsensi.length;
    const totalMenitTerlambat = daftarAbsensi.reduce((sum, a) => sum + (a.keterlambatan || 0), 0);

    const daftarCuti = await Izin.findAll({
      where: {
        idPengguna,
        jenisIzin: 'cuti',
        status: 'disetujui',
        [Op.or]: [
          { tanggalMulai: { [Op.between]: [awalBulan, akhirBulan] } },
          { tanggalSelesai: { [Op.between]: [awalBulan, akhirBulan] } },
          { tanggalMulai: { [Op.lte]: awalBulan }, tanggalSelesai: { [Op.gte]: akhirBulan } },
        ],
      },
      attributes: ['tanggalMulai', 'tanggalSelesai'],
    });

    let jumlahHariCuti = 0;
    for (const cuti of daftarCuti) {
      const mulai = new Date(Math.max(new Date(cuti.tanggalMulai), new Date(awalBulan)));
      const selesai = new Date(Math.min(new Date(cuti.tanggalSelesai), new Date(akhirBulan)));
      jumlahHariCuti += Math.max(0, Math.floor((selesai - mulai) / 86400000) + 1);
    }

    const gajiPokok = parseFloat(pengaturan.gajiPokok);
    const tunjanganKehadiran = parseFloat(pengaturan.tunjanganKehadiran);
    const potonganPerJam = parseFloat(pengaturan.potonganPerJamTerlambat);
    const potonganPerHariCuti = parseFloat(pengaturan.potonganPerHariCuti);

    const totalPotonganKeterlambatan = Math.floor(totalMenitTerlambat / 60) * potonganPerJam;
    const totalPotonganCuti = jumlahHariCuti * potonganPerHariCuti;
    const totalGaji = Math.max(0, gajiPokok + tunjanganKehadiran - totalPotonganKeterlambatan - totalPotonganCuti);

    return RepositoriSlipGaji.buatAtauPerbarui({
      idPengguna, bulan, tahun, gajiPokok, tunjanganKehadiran,
      totalPotonganKeterlambatan, totalPotonganCuti, totalGaji,
      jumlahHadir, totalMenitTerlambat, jumlahHariCuti,
      status: 'final', dibuatOleh: idAdmin,
    });
  }

  // ─── Jadwal Kirim Otomatis ──────────────────────────────────────────────────

  async ambilJadwal() {
    return JadwalKirimGaji.findOne({ order: [['createdAt', 'DESC']] });
  }

  async simpanJadwal(tanggalKirim, aktif, idAdmin) {
    const existing = await JadwalKirimGaji.findOne({ order: [['createdAt', 'DESC']] });
    if (existing) {
      await existing.update({ tanggalKirim, aktif, dibuatOleh: idAdmin });
      return existing;
    }
    return JadwalKirimGaji.create({ tanggalKirim, aktif, dibuatOleh: idAdmin });
  }

  /** Dipanggil oleh cron job setiap hari */
  async jalankanAutoKirim() {
    const jadwal = await this.ambilJadwal();
    if (!jadwal || !jadwal.aktif) return;

    const sekarang = new Date();
    if (sekarang.getDate() !== jadwal.tanggalKirim) return;

    const bulan = sekarang.getMonth() + 1;
    const tahun = sekarang.getFullYear();
    console.log(`[CRON] Auto-generate slip gaji ${bulan}/${tahun}`);
    await this.generateSlipBulan(bulan, tahun, null);
  }

  // ─── Ambil Slip Gaji ────────────────────────────────────────────────────────

  async ambilSemuaSlip(kueri) {
    return RepositoriSlipGaji.cariSemua(kueri);
  }

  async ambilSlipPerId(id) {
    const slip = await RepositoriSlipGaji.cariPerId(id);
    if (!slip) throw { statusCode: 404, message: 'Slip gaji tidak ditemukan' };
    return slip;
  }

  async ambilSlipPengguna(idPengguna, bulan, tahun) {
    if (bulan && tahun) {
      const slip = await RepositoriSlipGaji.cariPerPenggunaBulanTahun(idPengguna, bulan, tahun);
      if (!slip) throw { statusCode: 404, message: 'Slip gaji tidak ditemukan untuk bulan tersebut' };
      return slip;
    }
    return RepositoriSlipGaji.cariSemuaPerPengguna(idPengguna);
  }
}

module.exports = new LayananGaji();
