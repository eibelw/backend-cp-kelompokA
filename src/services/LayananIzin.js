const RepositoriIzin = require('../repositories/RepositoriIzin');
const RepositoriAbsensi = require('../repositories/RepositoriAbsensi');

// Layanan pengajuan izin dan sakit
class LayananIzin {
  async ajukanIzin(idPengguna, data) {
    const { jenisIzin, tanggalMulai, tanggalSelesai, alasan, fileDokumen } = data;

    if (new Date(tanggalMulai) > new Date(tanggalSelesai)) {
      throw { statusCode: 400, message: 'Tanggal mulai tidak boleh melebihi tanggal selesai' };
    }

    if (new Date(tanggalMulai) < new Date(new Date().toDateString())) {
      throw { statusCode: 400, message: 'Tidak bisa mengajukan izin untuk tanggal yang sudah lewat' };
    }

    const urlDokumen = fileDokumen ? `/uploads/documents/${fileDokumen.filename}` : null;

    const izin = await RepositoriIzin.buat({
      idPengguna,
      jenisIzin,
      tanggalMulai,
      tanggalSelesai,
      alasan,
      status: 'menunggu',
      urlDokumen,
    });

    return izin;
  }

  async ambilIzinSaya(idPengguna, kueri) {
    return RepositoriIzin.cariSemua({ ...kueri, idPengguna });
  }

  async ambilPerId(id, idPengguna = null) {
    const izin = await RepositoriIzin.cariPerId(id);
    if (!izin) throw { statusCode: 404, message: 'Data izin tidak ditemukan' };
    if (idPengguna && izin.idPengguna !== idPengguna) {
      throw { statusCode: 403, message: 'Akses ditolak' };
    }
    return izin;
  }

  async batalIzin(id, idPengguna) {
    const izin = await RepositoriIzin.cariPerId(id);
    if (!izin) throw { statusCode: 404, message: 'Data izin tidak ditemukan' };
    if (izin.idPengguna !== idPengguna) throw { statusCode: 403, message: 'Akses ditolak' };
    if (izin.status !== 'menunggu') {
      throw { statusCode: 400, message: 'Hanya pengajuan berstatus menunggu yang bisa dibatalkan' };
    }
    await RepositoriIzin.hapus(id);
  }

  async setujuiIzin(id, idAdmin) {
    const izin = await this._cariIzinMenunggu(id);

    await RepositoriIzin.perbarui(id, { status: 'disetujui', disetujuiOleh: idAdmin });

    // Buat record absensi otomatis untuk setiap tanggal selama izin
    const daftarTanggal = this._rentangTanggal(izin.tanggalMulai, izin.tanggalSelesai);
    for (const tanggal of daftarTanggal) {
      const sudahAda = await RepositoriAbsensi.cariPerPenggunaDanTanggal(izin.idPengguna, tanggal);
      if (!sudahAda) {
        await RepositoriAbsensi.buat({
          idPengguna: izin.idPengguna,
          tanggal,
          waktuMasuk: new Date(`${tanggal}T08:00:00`),
          latMasuk: 0,
          lngMasuk: 0,
          urlFoto: '',
          status: izin.jenisIzin,
          catatan: `${izin.jenisIzin === 'izin' ? 'Izin' : izin.jenisIzin === 'sakit' ? 'Sakit' : 'Cuti'}: ${izin.alasan}`,
        });
      }
    }

    return RepositoriIzin.cariPerId(id);
  }

  async tolakIzin(id, idAdmin) {
    await this._cariIzinMenunggu(id);
    return RepositoriIzin.perbarui(id, { status: 'ditolak', disetujuiOleh: idAdmin });
  }

  async ambilSemuaIzin(kueri) {
    return RepositoriIzin.cariSemua(kueri);
  }

  // Hasilkan array tanggal dari rentang tanggalMulai hingga tanggalSelesai
  _rentangTanggal(tanggalMulai, tanggalSelesai) {
    const daftar = [];
    const sekarang = new Date(tanggalMulai);
    const akhir = new Date(tanggalSelesai);
    while (sekarang <= akhir) {
      daftar.push(sekarang.toISOString().split('T')[0]);
      sekarang.setDate(sekarang.getDate() + 1);
    }
    return daftar;
  }

  async _cariIzinMenunggu(id) {
    const izin = await RepositoriIzin.cariPerId(id);
    if (!izin) throw { statusCode: 404, message: 'Data izin tidak ditemukan' };
    if (izin.status !== 'menunggu') {
      throw { statusCode: 400, message: 'Pengajuan ini sudah diproses sebelumnya' };
    }
    return izin;
  }
}

module.exports = new LayananIzin();
