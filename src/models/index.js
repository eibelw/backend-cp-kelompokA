// Inisialisasi semua model Sequelize dan daftarkan relasi antar tabel
const basisData = require('../config/database');

const Pengguna = require('./Pengguna')(basisData);
const Absensi = require('./Absensi')(basisData);
const Izin = require('./Izin')(basisData);
const LokasiKantor = require('./LokasiKantor')(basisData);
const PengaturanGaji = require('./PengaturanGaji')(basisData);
const SlipGaji = require('./SlipGaji')(basisData);
const JadwalKirimGaji = require('./JadwalKirimGaji')(basisData);

const semuaModel = { Pengguna, Absensi, Izin, LokasiKantor, PengaturanGaji, SlipGaji, JadwalKirimGaji };

// Jalankan fungsi kaitkan() pada setiap model yang memilikinya
Object.values(semuaModel).forEach((model) => {
  if (typeof model.kaitkan === 'function') {
    model.kaitkan(semuaModel);
  }
});

module.exports = { basisData, ...semuaModel };
