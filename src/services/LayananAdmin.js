const path = require('path');
const fs = require('fs');
const RepositoriPengguna = require('../repositories/RepositoriPengguna');
const RepositoriAbsensi = require('../repositories/RepositoriAbsensi');
const RepositoriLokasiKantor = require('../repositories/RepositoriLokasiKantor');


// Layanan admin: manajemen pengguna, rekap absensi, dan lokasi kantor
class LayananAdmin {
  // ─── Manajemen Pengguna ─────────────────────────────────────────────────────

  async ambilSemuaPengguna(kueri) {
    return RepositoriPengguna.cariSemua(kueri);
  }

  async ambilPenggunaPerId(id) {
    const pengguna = await RepositoriPengguna.cariPerId(id);
    if (!pengguna) throw { statusCode: 404, message: 'Pengguna tidak ditemukan' };
    return pengguna;
  }

  async buatPengguna(data) {
    const emailSudahAda = await RepositoriPengguna.cariPerEmail(data.email);
    if (emailSudahAda) throw { statusCode: 409, message: 'Email sudah terdaftar' };

    const { idLokasiKantor, ...sisaData } = data;
    const lokasi = await RepositoriLokasiKantor.cariPerId(idLokasiKantor);
    if (!lokasi) throw { statusCode: 404, message: 'Lokasi kantor tidak ditemukan' };

    const idPegawai = await RepositoriPengguna.idBerikutnyaUntukLokasi(lokasi.kode);
    return RepositoriPengguna.buat({ ...sisaData, idPegawai });
  }

  async prakiraIdPegawai(idLokasiKantor) {
    const lokasi = await RepositoriLokasiKantor.cariPerId(idLokasiKantor);
    if (!lokasi) throw { statusCode: 404, message: 'Lokasi kantor tidak ditemukan' };
    return RepositoriPengguna.idBerikutnyaUntukLokasi(lokasi.kode);
  }

  async perbaruiPengguna(id, data) {
    const pengguna = await RepositoriPengguna.cariPerId(id);
    if (!pengguna) throw { statusCode: 404, message: 'Pengguna tidak ditemukan' };
    return RepositoriPengguna.perbarui(id, data);
  }

  async hapusPengguna(id) {
    const pengguna = await RepositoriPengguna.cariPerId(id);
    if (!pengguna) throw { statusCode: 404, message: 'Pengguna tidak ditemukan' };
    await RepositoriPengguna.nonaktifkan(id);
  }

  async ubahKataSandiPengguna(id, kataSandiBaru) {
    const pengguna = await RepositoriPengguna.cariPerIdDenganKataSandi(id);
    if (!pengguna) throw { statusCode: 404, message: 'Pengguna tidak ditemukan' };
    pengguna.kataSandi = kataSandiBaru;
    await pengguna.save();
  }

  async hapusFotoPengguna(id) {
    const pengguna = await RepositoriPengguna.cariPerId(id);
    if (!pengguna) throw { statusCode: 404, message: 'Pengguna tidak ditemukan' };
    if (pengguna.urlFoto) {
      const filePath = path.join(process.cwd(), pengguna.urlFoto.replace(/^\//, ''));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      await RepositoriPengguna.perbarui(id, { urlFoto: null });
    }
  }

  // ─── Manajemen Absensi ──────────────────────────────────────────────────────

  async ambilRekapAbsensi(kueri) {
    return RepositoriAbsensi.cariSemua(kueri);
  }

  async ambilDetailAbsensi(id) {
    const absensi = await RepositoriAbsensi.cariPerId(id);
    if (!absensi) throw { statusCode: 404, message: 'Data absensi tidak ditemukan' };
    return absensi;
  }

  async perbaruiAbsensiManual(id, data) {
    const absensi = await RepositoriAbsensi.cariPerId(id);
    if (!absensi) throw { statusCode: 404, message: 'Data absensi tidak ditemukan' };
    return RepositoriAbsensi.perbarui(id, data);
  }

  async ambilRekapUntukEkspor(kueri) {
    return RepositoriAbsensi.ambilRekap(kueri);
  }

  // ─── Manajemen Lokasi Kantor ────────────────────────────────────────────────

  async ambilSemuaLokasi() {
    return RepositoriLokasiKantor.cariSemua();
  }

  async buatLokasi(data) {
    const kodeSudahAda = await RepositoriLokasiKantor.cariPerKode(data.kode);
    if (kodeSudahAda) throw { statusCode: 409, message: 'Kode lokasi sudah digunakan' };
    return RepositoriLokasiKantor.buat(data);
  }

  async perbaruiLokasi(id, data) {
    const lokasi = await RepositoriLokasiKantor.cariPerId(id);
    if (!lokasi) throw { statusCode: 404, message: 'Lokasi tidak ditemukan' };
    return RepositoriLokasiKantor.perbarui(id, data);
  }

  async hapusLokasi(id) {
    const lokasi = await RepositoriLokasiKantor.cariPerId(id);
    if (!lokasi) throw { statusCode: 404, message: 'Lokasi tidak ditemukan' };
    await RepositoriLokasiKantor.hapus(id);
  }
}

module.exports = new LayananAdmin();
