require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { basisData } = require('../models');

// Hapus semua tabel dan buat ulang dari awal (HATI-HATI: semua data akan terhapus)
async function jalankanMigrasi() {
  try {
    await basisData.authenticate();
    console.log("");
    console.log('Koneksi database berhasil.');
    console.log("");

    await basisData.sync({ force: true });
    console.log("");
    console.log('Semua tabel berhasil dibuat ulang.');
    console.log("");

    process.exit(0);
  } catch (kesalahan) {
    console.error('Migrasi gagal:', kesalahan);
    process.exit(1);
  }
}

jalankanMigrasi();
