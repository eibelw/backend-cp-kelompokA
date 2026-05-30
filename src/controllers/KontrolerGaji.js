const LayananGaji = require('../services/LayananGaji');
const ResponAPI = require('../utils/ResponAPI');

class KontrolerGaji {
  // ─── Admin: Pengaturan Gaji ─────────────────────────────────────────────────

  async ambilPengaturan(req, res, berikutnya) {
    try {
      const daftar = await LayananGaji.ambilSemuaPengaturan();
      return ResponAPI.berhasil(res, daftar, 'Daftar pengaturan gaji');
    } catch (err) {
      berikutnya(err);
    }
  }

  async buatPengaturan(req, res, berikutnya) {
    try {
      const pengaturan = await LayananGaji.buatPengaturan(req.body, req.pengguna.id);
      return ResponAPI.dibuatBerhasil(res, pengaturan, 'Pengaturan gaji berhasil disimpan');
    } catch (err) {
      berikutnya(err);
    }
  }

  async perbaruiPengaturan(req, res, berikutnya) {
    try {
      const pengaturan = await LayananGaji.perbaruiPengaturan(req.params.id, req.body);
      return ResponAPI.berhasil(res, pengaturan, 'Pengaturan gaji berhasil diperbarui');
    } catch (err) {
      berikutnya(err);
    }
  }

  // ─── Admin: Generate & Kelola Slip Gaji ────────────────────────────────────

  async generateSlip(req, res, berikutnya) {
    try {
      const { bulan, tahun, idPengguna } = req.body;
      if (!bulan || !tahun) return ResponAPI.permintaanTidakValid(res, 'Bulan dan tahun wajib diisi');
      const hasilSlip = await LayananGaji.generateSlipBulan(
        parseInt(bulan),
        parseInt(tahun),
        req.pengguna.id,
        idPengguna || null
      );
      return ResponAPI.berhasil(res, hasilSlip, `${hasilSlip.length} slip gaji berhasil digenerate`);
    } catch (err) {
      berikutnya(err);
    }
  }

  async ambilSemuaSlip(req, res, berikutnya) {
    try {
      const { halaman, batas, bulan, tahun, idPengguna, status } = req.query;
      const hasil = await LayananGaji.ambilSemuaSlip({
        halaman: parseInt(halaman) || 1,
        batas: parseInt(batas) || 10,
        bulan: bulan ? parseInt(bulan) : undefined,
        tahun: tahun ? parseInt(tahun) : undefined,
        idPengguna,
        status,
      });
      return ResponAPI.berhasilDenganPaginasi(res, { data: hasil.slip, ...hasil }, 'Daftar slip gaji');
    } catch (err) {
      berikutnya(err);
    }
  }

  async ambilSlipPerId(req, res, berikutnya) {
    try {
      const slip = await LayananGaji.ambilSlipPerId(req.params.id);
      return ResponAPI.berhasil(res, slip);
    } catch (err) {
      berikutnya(err);
    }
  }

  async hapusPengaturan(req, res, berikutnya) {
    try {
      await LayananGaji.hapusPengaturan(req.params.id);
      return ResponAPI.berhasil(res, null, 'Pengaturan gaji berhasil dihapus');
    } catch (err) {
      berikutnya(err);
    }
  }

  // ─── Admin: Jadwal Kirim Otomatis ───────────────────────────────────────────

  async ambilJadwal(req, res, berikutnya) {
    try {
      const jadwal = await LayananGaji.ambilJadwal();
      return ResponAPI.berhasil(res, jadwal, 'Jadwal kirim gaji');
    } catch (err) {
      berikutnya(err);
    }
  }

  async simpanJadwal(req, res, berikutnya) {
    try {
      const { tanggalKirim, aktif } = req.body;
      if (!tanggalKirim) return ResponAPI.permintaanTidakValid(res, 'Tanggal kirim wajib diisi');
      const jadwal = await LayananGaji.simpanJadwal(parseInt(tanggalKirim), aktif !== false, req.pengguna.id);
      return ResponAPI.berhasil(res, jadwal, 'Jadwal kirim gaji berhasil disimpan');
    } catch (err) {
      berikutnya(err);
    }
  }

  // ─── User: Lihat Slip Gaji Sendiri ─────────────────────────────────────────

  async ambilSlipSaya(req, res, berikutnya) {
    try {
      const { bulan, tahun } = req.query;
      const slip = await LayananGaji.ambilSlipPengguna(
        req.pengguna.id,
        bulan ? parseInt(bulan) : undefined,
        tahun ? parseInt(tahun) : undefined
      );
      return ResponAPI.berhasil(res, slip, 'Data slip gaji');
    } catch (err) {
      berikutnya(err);
    }
  }
}

module.exports = new KontrolerGaji();
