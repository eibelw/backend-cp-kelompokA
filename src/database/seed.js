require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { basisData, Pengguna, LokasiKantor } = require('../models');

// Isi data awal: akun admin, beberapa pegawai, dan satu lokasi kantor
async function isiDataAwal() {
  try {
    await basisData.authenticate();

    console.log('Mengisi akun admin...');
    const [admin] = await Pengguna.findOrCreate({
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
    console.log(`Admin: ${admin.email} | kata sandi: admin123`);

    console.log('Mengisi akun pegawai...');
    const daftarPegawai = [
      // {
      //   idPegawai: 'PEG_001',
      //   nama: 'Budi Santoso',
      //   email: 'budi@perusahaan.com',
      //   kataSandi: 'pegawai123',
      //   peran: 'pegawai',
      //   departemen: 'Keuangan',
      //   jabatan: 'Staf Keuangan',
      //   telepon: '081200000002',
      // },
      // {
      //   idPegawai: 'PEG_002',
      //   nama: 'Sari Dewi',
      //   email: 'sari@perusahaan.com',
      //   kataSandi: 'pegawai123',
      //   peran: 'pegawai',
      //   departemen: 'Pemasaran',
      //   jabatan: 'Staf Pemasaran',
      //   telepon: '081200000003',
      // },
      // {
      //   idPegawai: 'PEG_003',
      //   nama: 'Ahmad Fauzi',
      //   email: 'ahmad@perusahaan.com',
      //   kataSandi: 'pegawai123',
      //   peran: 'pegawai',
      //   departemen: 'IT',
      //   jabatan: 'Pengembang Perangkat Lunak',
      //   telepon: '081200000004',
      // },
    ];

    for (const dataPegawai of daftarPegawai) {
      const [pengguna] = await Pengguna.findOrCreate({
        where: { email: dataPegawai.email },
        defaults: dataPegawai,
      });
      console.log(`Pegawai: ${pengguna.email} | kata sandi: pegawai123`);
    }

    console.log('Mengisi lokasi kantor...');
    await LokasiKantor.findOrCreate({
      where: { nama: 'Kantor Pusat' },
      defaults: {
        nama: 'Kantor Pusat',
        latitude: -6.2088,
        longitude: 106.8456,
        radius: 10000,
        aktif: true,
        kode: "PST"
      },
    });
    console.log('Lokasi: Kantor Pusat (Jakarta) – radius 100 meter');

    console.log('\nData awal berhasil diisi!');
    process.exit(0);
  } catch (kesalahan) {
    console.error('Gagal mengisi data awal:', kesalahan);
    process.exit(1);
  }
}

isiDataAwal();
