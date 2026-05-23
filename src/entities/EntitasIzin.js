// Entitas domain Izin — representasi bersih data pengajuan izin
class EntitasIzin {
  constructor(data) {
    this.id = data.id;
    this.idPengguna = data.idPengguna;
    this.jenisIzin = data.jenisIzin;
    this.tanggalMulai = data.tanggalMulai;
    this.tanggalSelesai = data.tanggalSelesai;
    this.alasan = data.alasan;
    this.status = data.status;
    this.disetujuiOleh = data.disetujuiOleh;
    this.urlDokumen = data.urlDokumen;
    this.pengguna = data.pengguna || null;
    this.penyetuju = data.penyetuju || null;
    this.dibuatPada = data.createdAt;
    this.diperbaruiPada = data.updatedAt;
  }

  hitungDurasi() {
    const mulai = new Date(this.tanggalMulai);
    const selesai = new Date(this.tanggalSelesai);
    return Math.floor((selesai - mulai) / (1000 * 60 * 60 * 24)) + 1;
  }

  toJSON() {
    return {
      id: this.id,
      idPengguna: this.idPengguna,
      jenisIzin: this.jenisIzin,
      tanggalMulai: this.tanggalMulai,
      tanggalSelesai: this.tanggalSelesai,
      durasiHari: this.hitungDurasi(),
      alasan: this.alasan,
      status: this.status,
      disetujuiOleh: this.disetujuiOleh,
      urlDokumen: this.urlDokumen,
      pengguna: this.pengguna,
      penyetuju: this.penyetuju,
      dibuatPada: this.dibuatPada,
      diperbaruiPada: this.diperbaruiPada,
    };
  }
}

module.exports = EntitasIzin;
