require('dotenv').config();
const cron = require('node-cron');
const bcrypt = require('bcryptjs');
const aplikasi = require('./src/config/app');
const { basisData, Pengguna, LokasiKantor } = require('./src/models');

const PORT = process.env.PORT || 3000;

async function isiDataAwal() {
  await Pengguna.findOrCreate({
    where: { email: 'admin@perusahaan.com' },
    defaults: {
      idPegawai: 'ADM_001',
      nama: 'Administrator',
      email: 'admin@perusahaan.com',
      kataSandi: 'admin123',
      peran: 'admin',
      departemen: 'IT',
      jabatan: 'Administrator Sistem',
      telepon: '081200000001',
      jenisKelamin: 'laki-laki',
      aktif: true,
    },
  });

  await LokasiKantor.findOrCreate({
    where: { kode: 'PST' },
    defaults: {
      kode: 'PST',
      nama: 'Kantor Pusat',
      latitude: -6.2088,
      longitude: 106.8456,
      radius: 10000,
      aktif: true,
    },
  });

  console.log('Data awal siap. Login: admin@perusahaan.com / admin123');
}

async function jalankanServer() {
  try {
    // Buat semua tabel otomatis di SQLite in-memory
    await basisData.sync({ force: true });
    console.log('Tabel berhasil dibuat (SQLite in-memory).');

    await isiDataAwal();

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
      console.log(`Mode: in-memory (data tidak tersimpan saat server mati)`);
    });
  } catch (kesalahan) {
    console.error('Gagal menjalankan server:', kesalahan);
    process.exit(1);
  }
}

jalankanServer();
