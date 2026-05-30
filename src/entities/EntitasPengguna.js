// Entitas domain Pengguna — representasi bersih data pegawai tanpa logika database
class EntitasPengguna {
  constructor(data) {
    this.id = data.id;
    this.idPegawai = data.idPegawai;
    this.nama = data.nama;
    this.email = data.email;
    this.peran = data.peran;
    this.departemen = data.departemen;
    this.jabatan = data.jabatan;
    this.telepon = data.telepon;
    this.jenisKelamin = data.jenisKelamin;
    this.urlFoto = data.urlFoto;
    this.aktif = data.aktif;
    this.dibuatPada = data.createdAt;
    this.diperbaruiPada = data.updatedAt;
  }

  toJSON() {
    return {
      id: this.id,
      idPegawai: this.idPegawai,
      nama: this.nama,
      email: this.email,
      peran: this.peran,
      departemen: this.departemen,
      jabatan: this.jabatan,
      telepon: this.telepon,
      jenisKelamin: this.jenisKelamin,
      urlFoto: this.urlFoto,
      aktif: this.aktif,
      dibuatPada: this.dibuatPada,
      diperbaruiPada: this.diperbaruiPada,
    };
  }
}

module.exports = EntitasPengguna;
