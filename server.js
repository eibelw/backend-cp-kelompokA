require('dotenv').config();
const aplikasi = require('./src/config/app');
const { basisData } = require('./src/models');

// Inisialisasi penuh: DB authenticate + sync + cron + listen
// Hanya berjalan di development lokal, TIDAK di Vercel (production = serverless)
async function jalankanServer() {
  try {
    await basisData.authenticate();
    console.log('Koneksi database berhasil.');

    await basisData.sync();
    console.log('Model database berhasil disinkronkan.');

    // Cron job: cek jadwal kirim slip gaji setiap hari jam 07:00
    const cron = require('node-cron');
    const LayananGaji = require('./src/services/LayananGaji');
    cron.schedule('0 7 * * *', async () => {
      try {
        await LayananGaji.jalankanAutoKirim();
      } catch (err) {
        console.error('[CRON] Gagal auto-kirim slip gaji:', err.message);
      }
    }, { timezone: process.env.TZ || 'Asia/Jakarta' });

    const PORT = process.env.PORT || 3000;
    aplikasi.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
      console.log(`Lingkungan: ${process.env.NODE_ENV}`);
    });
  } catch (kesalahan) {
    console.error('Gagal menjalankan server:', kesalahan);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'production') {
  jalankanServer();
}

// Export app untuk Vercel (serverless handler)
module.exports = aplikasi;
