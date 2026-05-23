// Entitas domain LokasiKantor — representasi bersih data koordinat GPS kantor
class EntitasLokasiKantor {
  constructor(data) {
    this.id = data.id;
    this.nama = data.nama;
    this.latitude = parseFloat(data.latitude);
    this.longitude = parseFloat(data.longitude);
    this.radius = data.radius;
    this.aktif = data.aktif;
    this.dibuatPada = data.createdAt;
    this.diperbaruiPada = data.updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      nama: this.nama,
      latitude: this.latitude,
      longitude: this.longitude,
      radius: this.radius,
      aktif: this.aktif,
      dibuatPada: this.dibuatPada,
      diperbaruiPada: this.diperbaruiPada,
    };
  }
}

module.exports = EntitasLokasiKantor;
