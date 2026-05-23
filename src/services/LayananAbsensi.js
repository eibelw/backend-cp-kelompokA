const RepositoriAbsensi = require('../repositories/RepositoriAbsensi');
const RepositoriLokasiKantor = require('../repositories/RepositoriLokasiKantor');
const { validasiLokasi } = require('../utils/validasiGPS');
const { tanggalHariIni, dalamJamAbsenMasuk, setelahJamAbsenKeluar } = require('../utils/bantuanWaktu');

// Layanan absensi: check-in, check-out, riwayat kehadiran
class LayananAbsensi {
  async masukAbsen(idPengguna, { latitude, longitude, fileFoto }) {
    const hari = tanggalHariIni();

    // Cegah double absen pada hari yang sama
    const sudahAbsen = await RepositoriAbsensi.cariHariIniPerPengguna(idPengguna);
    if (sudahAbsen) throw { statusCode: 409, message: 'Anda sudah melakukan absensi hari ini' };

    // Periksa apakah waktu absen masuk masih dalam jendela yang diizinkan
    // if (!dalamJamAbsenMasuk()) {
    //   throw {
    //     statusCode: 400,
    //     message: `Absen masuk hanya bisa dilakukan pukul ${process.env.CHECK_IN_START || '07:00'} – ${process.env.CHECK_IN_END || '10:00'}`,
    //   };
    // }

    // Validasi lokasi GPS dengan rumus Haversine
    const daftarLokasi = await RepositoriLokasiKantor.cariYangAktif();
    if (daftarLokasi.length === 0) {
      throw { statusCode: 400, message: 'Belum ada lokasi kantor yang terdaftar' };
    }

    const hasilGPS = validasiLokasi(latitude, longitude, daftarLokasi);
    if (!hasilGPS.valid) {
      const jarakKm = (hasilGPS.jarak / 1000).toFixed(2);
      throw {
        statusCode: 400,
        message: `Anda berada di luar area kantor. Jarak ke kantor terdekat: ${jarakKm} km`,
      };
    }

    if (!fileFoto) throw { statusCode: 400, message: 'Foto selfie wajib diunggah' };

    const urlFoto = `/uploads/photos/${fileFoto.filename}`;
    const sekarang = new Date();

    // Hitung keterlambatan berdasarkan jam masuk kerja
    const [jamMulai, menitMulai] = (process.env.CHECK_IN_START || '08:00').split(':').map(Number);
    const batasWaktu = new Date(sekarang);
    batasWaktu.setHours(jamMulai, menitMulai, 0, 0);
    const keterlambatan = sekarang > batasWaktu
      ? Math.floor((sekarang - batasWaktu) / 60000)
      : 0;

    const absensi = await RepositoriAbsensi.buat({
      idPengguna,
      tanggal: hari,
      waktuMasuk: sekarang,
      latMasuk: latitude,
      lngMasuk: longitude,
      urlFoto,
      keterlambatan,
      status: 'hadir',
    });

    return absensi;
  }

  async keluarAbsen(idPengguna, { latitude, longitude }) {
    const hari = tanggalHariIni();
    const absensi = await RepositoriAbsensi.cariHariIniPerPengguna(idPengguna);

    if (!absensi) throw { statusCode: 404, message: 'Anda belum melakukan absen masuk hari ini' };
    if (absensi.waktuKeluar) throw { statusCode: 409, message: 'Anda sudah melakukan absen keluar hari ini' };

    if (!setelahJamAbsenKeluar()) {
      throw {
        statusCode: 400,
        message: `Absen keluar baru bisa dilakukan setelah pukul ${process.env.CHECK_OUT_START || '16:00'}`,
      };
    }

    // Validasi GPS juga saat absen keluar
    const daftarLokasi = await RepositoriLokasiKantor.cariYangAktif();
    const hasilGPS = validasiLokasi(latitude, longitude, daftarLokasi);
    if (!hasilGPS.valid) {
      const jarakKm = (hasilGPS.jarak / 1000).toFixed(2);
      throw {
        statusCode: 400,
        message: `Anda berada di luar area kantor. Jarak ke kantor terdekat: ${jarakKm} km`,
      };
    }

    const diperbarui = await RepositoriAbsensi.perbarui(absensi.id, {
      waktuKeluar: new Date(),
      latKeluar: latitude,
      lngKeluar: longitude,
    });

    return diperbarui;
  }

  async ambilHariIni(idPengguna) {
    return RepositoriAbsensi.cariHariIniPerPengguna(idPengguna);
  }

  async ambilRiwayat(idPengguna, kueri) {
    return RepositoriAbsensi.cariSemua({ ...kueri, idPengguna });
  }

  async ambilPerId(id) {
    const absensi = await RepositoriAbsensi.cariPerId(id);
    if (!absensi) throw { statusCode: 404, message: 'Data absensi tidak ditemukan' };
    return absensi;
  }
}

module.exports = new LayananAbsensi();
