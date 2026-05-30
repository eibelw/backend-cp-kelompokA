// Entitas domain Absensi — representasi bersih data kehadiran harian
class EntitasAbsensi {
  constructor(data) {
    this.id = data.id;
    this.idPengguna = data.idPengguna;
    this.tanggal = data.tanggal;
    this.waktuMasuk = data.waktuMasuk;
    this.waktuKeluar = data.waktuKeluar;
    this.latMasuk = data.latMasuk;
    this.lngMasuk = data.lngMasuk;
    this.latKeluar = data.latKeluar;
    this.lngKeluar = data.lngKeluar;
    this.urlFoto = data.urlFoto;
    this.keterlambatan = data.keterlambatan ?? 0;
    this.status = data.status;
    this.catatan = data.catatan;
    this.pengguna = data.pengguna || null;
    this.dibuatPada = data.createdAt;
    this.diperbaruiPada = data.updatedAt;
  }

  sudahCheckOut() {
    return this.waktuKeluar !== null;
  }

  toJSON() {
    return {
      id: this.id,
      idPengguna: this.idPengguna,
      tanggal: this.tanggal,
      waktuMasuk: this.waktuMasuk,
      waktuKeluar: this.waktuKeluar,
      lokasiMasuk: { lat: this.latMasuk, lng: this.lngMasuk },
      lokasiKeluar: this.latKeluar
        ? { lat: this.latKeluar, lng: this.lngKeluar }
        : null,
      urlFoto: this.urlFoto,
      keterlambatan: this.keterlambatan,
      status: this.status,
      catatan: this.catatan,
      pengguna: this.pengguna,
      dibuatPada: this.dibuatPada,
      diperbaruiPada: this.diperbaruiPada,
    };
  }
}

module.exports = EntitasAbsensi;
