const LayananAdmin = require('../services/LayananAdmin');
const LayananIzin = require('../services/LayananIzin');
const ResponAPI = require('../utils/ResponAPI');
const { eksporKeExcel, eksporKePDF } = require('../utils/ekspor');

// Kontroler admin: menangani manajemen pengguna, absensi, izin, dan ekspor
class KontrolerAdmin {
  // ─── Manajemen Pengguna ─────────────────────────────────────────────────────

  async ambilPengguna(req, res, berikutnya) {
    try {
      const { halaman, batas, cari, departemen, peran } = req.query;
      const hasil = await LayananAdmin.ambilSemuaPengguna({
        halaman: parseInt(halaman) || 1,
        batas: parseInt(batas) || 10,
        cari,
        departemen,
        peran,
      });
      return ResponAPI.berhasilDenganPaginasi(res, { data: hasil.pengguna, ...hasil }, 'Daftar pegawai');
    } catch (err) {
      berikutnya(err);
    }
  }

  async prakiraIdPegawai(req, res, berikutnya) {
    try {
      const { idLokasi } = req.query;
      if (!idLokasi) return ResponAPI.permintaanTidakValid(res, 'Parameter idLokasi wajib diisi');
      const idPegawai = await LayananAdmin.prakiraIdPegawai(idLokasi);
      return ResponAPI.berhasil(res, { idPegawai }, 'Prakiraan ID pegawai');
    } catch (err) {
      berikutnya(err);
    }
  }

  async ambilPenggunaPerId(req, res, berikutnya) {
    try {
      const pengguna = await LayananAdmin.ambilPenggunaPerId(req.params.id);
      return ResponAPI.berhasil(res, pengguna);
    } catch (err) {
      berikutnya(err);
    }
  }

  async buatPengguna(req, res, berikutnya) {
    try {
      const pengguna = await LayananAdmin.buatPengguna(req.body);
      return ResponAPI.dibuatBerhasil(res, pengguna.keJSONAman(), 'Pegawai berhasil ditambahkan');
    } catch (err) {
      berikutnya(err);
    }
  }

  async perbaruiPengguna(req, res, berikutnya) {
    try {
      const pengguna = await LayananAdmin.perbaruiPengguna(req.params.id, req.body);
      return ResponAPI.berhasil(res, pengguna, 'Data pegawai berhasil diperbarui');
    } catch (err) {
      berikutnya(err);
    }
  }

  async hapusPengguna(req, res, berikutnya) {
    try {
      await LayananAdmin.hapusPengguna(req.params.id);
      return ResponAPI.berhasil(res, null, 'Pegawai berhasil dinonaktifkan');
    } catch (err) {
      berikutnya(err);
    }
  }

  async ubahKataSandiPengguna(req, res, berikutnya) {
    try {
      await LayananAdmin.ubahKataSandiPengguna(req.params.id, req.body.kataSandiBaru);
      return ResponAPI.berhasil(res, null, 'Kata sandi pegawai berhasil diubah');
    } catch (err) {
      berikutnya(err);
    }
  }

  async hapusFotoPengguna(req, res, berikutnya) {
    try {
      await LayananAdmin.hapusFotoPengguna(req.params.id);
      return ResponAPI.berhasil(res, null, 'Foto profil pegawai berhasil dihapus');
    } catch (err) {
      berikutnya(err);
    }
  }

  // ─── Manajemen Absensi ──────────────────────────────────────────────────────

  async ambilAbsensi(req, res, berikutnya) {
    try {
      const { halaman, batas, idPengguna, tanggal, tanggalMulai, tanggalSelesai, status } = req.query;
      const hasil = await LayananAdmin.ambilRekapAbsensi({
        halaman: parseInt(halaman) || 1,
        batas: parseInt(batas) || 20,
        idPengguna,
        tanggal,
        tanggalMulai,
        tanggalSelesai,
        status,
      });
      return ResponAPI.berhasilDenganPaginasi(res, { data: hasil.absensi, ...hasil }, 'Data absensi');
    } catch (err) {
      berikutnya(err);
    }
  }

  async ambilAbsensiPerId(req, res, berikutnya) {
    try {
      const absensi = await LayananAdmin.ambilDetailAbsensi(req.params.id);
      return ResponAPI.berhasil(res, absensi);
    } catch (err) {
      berikutnya(err);
    }
  }

  async perbaruiAbsensi(req, res, berikutnya) {
    try {
      const absensi = await LayananAdmin.perbaruiAbsensiManual(req.params.id, req.body);
      return ResponAPI.berhasil(res, absensi, 'Data absensi berhasil diperbarui');
    } catch (err) {
      berikutnya(err);
    }
  }

  // ─── Manajemen Izin (Admin) ─────────────────────────────────────────────────

  async ambilSemuaIzin(req, res, berikutnya) {
    try {
      const { halaman, batas, status, idPengguna } = req.query;
      const hasil = await LayananIzin.ambilSemuaIzin({
        halaman: parseInt(halaman) || 1,
        batas: parseInt(batas) || 10,
        status,
        idPengguna,
      });
      return ResponAPI.berhasilDenganPaginasi(res, { data: hasil.izin, ...hasil }, 'Daftar pengajuan izin');
    } catch (err) {
      berikutnya(err);
    }
  }

  async setujuiIzin(req, res, berikutnya) {
    try {
      const izin = await LayananIzin.setujuiIzin(req.params.id, req.pengguna.id);
      return ResponAPI.berhasil(res, izin, 'Pengajuan izin disetujui');
    } catch (err) {
      berikutnya(err);
    }
  }

  async tolakIzin(req, res, berikutnya) {
    try {
      const izin = await LayananIzin.tolakIzin(req.params.id, req.pengguna.id);
      return ResponAPI.berhasil(res, izin, 'Pengajuan izin ditolak');
    } catch (err) {
      berikutnya(err);
    }
  }

  // ─── Ekspor Data ────────────────────────────────────────────────────────────

  async eksporExcel(req, res, berikutnya) {
    try {
      const { tanggalMulai, tanggalSelesai, idPengguna, departemen } = req.query;
      const daftarAbsensi = await LayananAdmin.ambilRekapUntukEkspor({ tanggalMulai, tanggalSelesai, idPengguna, departemen });
      const namaFile = `rekap-absensi-${tanggalMulai || 'semua'}-${tanggalSelesai || 'semua'}`;
      await eksporKeExcel(daftarAbsensi, res, namaFile);
    } catch (err) {
      berikutnya(err);
    }
  }

  async eksporPDF(req, res, berikutnya) {
    try {
      const { tanggalMulai, tanggalSelesai, idPengguna, departemen } = req.query;
      const daftarAbsensi = await LayananAdmin.ambilRekapUntukEkspor({ tanggalMulai, tanggalSelesai, idPengguna, departemen });
      const namaFile = `rekap-absensi-${tanggalMulai || 'semua'}-${tanggalSelesai || 'semua'}`;
      const judul = `Rekap Absensi Pegawai${tanggalMulai ? ` (${tanggalMulai} s/d ${tanggalSelesai})` : ''}`;
      eksporKePDF(daftarAbsensi, res, namaFile, judul);
    } catch (err) {
      berikutnya(err);
    }
  }

  // ─── Manajemen Lokasi Kantor ────────────────────────────────────────────────

  async ambilLokasi(req, res, berikutnya) {
    try {
      const lokasi = await LayananAdmin.ambilSemuaLokasi();
      return ResponAPI.berhasil(res, lokasi, 'Daftar lokasi kantor');
    } catch (err) {
      berikutnya(err);
    }
  }

  async buatLokasi(req, res, berikutnya) {
    try {
      const lokasi = await LayananAdmin.buatLokasi(req.body);
      return ResponAPI.dibuatBerhasil(res, lokasi, 'Lokasi kantor berhasil ditambahkan');
    } catch (err) {
      berikutnya(err);
    }
  }

  async perbaruiLokasi(req, res, berikutnya) {
    try {
      const lokasi = await LayananAdmin.perbaruiLokasi(req.params.id, req.body);
      return ResponAPI.berhasil(res, lokasi, 'Lokasi kantor berhasil diperbarui');
    } catch (err) {
      berikutnya(err);
    }
  }

  async hapusLokasi(req, res, berikutnya) {
    try {
      await LayananAdmin.hapusLokasi(req.params.id);
      return ResponAPI.berhasil(res, null, 'Lokasi kantor berhasil dihapus');
    } catch (err) {
      berikutnya(err);
    }
  }
}

module.exports = new KontrolerAdmin();
