require('dotenv').config();
const cron = require('node-cron');
const aplikasi = require('./src/config/app');
const { basisData } = require('./src/models');

const PORT = process.env.PORT || 3000;

async function jalankanServer() {
  try {
    // Uji koneksi ke database PostgreSQL
    await basisData.authenticate();
    console.log('Koneksi database berhasil.');

    // Periksa apakah semua tabel sudah ada (jalankan migrasi.js terlebih dahulu)
    await basisData.sync();
    console.log('Model database berhasil disinkronkan.');

    // Cron job: cek jadwal kirim slip gaji setiap hari jam 07:00
    const LayananGaji = require('./src/services/LayananGaji');
    cron.schedule('0 7 * * *', async () => {
      try {
        await LayananGaji.jalankanAutoKirim();
      } catch (err) {
        console.error('[CRON] Gagal auto-kirim slip gaji:', err.message);
      }
    }, { timezone: process.env.TZ || 'Asia/Jakarta' });

    aplikasi.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
      console.log(`Lingkungan: ${process.env.NODE_ENV}`);
    });
  } catch (kesalahan) {
    console.error('Gagal menjalankan server:', kesalahan);
    process.exit(1);
  }
}

jalankanServer();
