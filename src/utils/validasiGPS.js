/**
 * Hitung jarak antara dua koordinat GPS menggunakan rumus Haversine.
 * Mengembalikan jarak dalam satuan meter.
 */
function hitungJarak(lat1, lng1, lat2, lng2) {
  const radiusBumi = 6371000; // radius bumi dalam meter
  const keRadian = (derajat) => (derajat * Math.PI) / 180;

  const selisihLat = keRadian(lat2 - lat1);
  const selisihLng = keRadian(lng2 - lng1);

  const a =
    Math.sin(selisihLat / 2) ** 2 +
    Math.cos(keRadian(lat1)) * Math.cos(keRadian(lat2)) * Math.sin(selisihLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radiusBumi * c;
}

/**
 * Validasi apakah koordinat pengguna berada dalam radius salah satu lokasi kantor.
 * @param {number} latPengguna - Latitude pengguna
 * @param {number} lngPengguna - Longitude pengguna
 * @param {Array}  daftarLokasi - Array objek { latitude, longitude, radius, nama }
 * @returns {{ valid: boolean, lokasi: object|null, jarak: number }}
 */
function validasiLokasi(latPengguna, lngPengguna, daftarLokasi) {
  for (const lokasi of daftarLokasi) {
    const jarak = hitungJarak(
      latPengguna,
      lngPengguna,
      parseFloat(lokasi.latitude),
      parseFloat(lokasi.longitude)
    );

    if (jarak <= lokasi.radius) {
      return { valid: true, lokasi, jarak: Math.round(jarak) };
    }
  }

  // Temukan lokasi kantor terdekat untuk pesan error yang informatif
  const terdekat = daftarLokasi.reduce((paling, lokasi) => {
    const jarak = hitungJarak(latPengguna, lngPengguna, lokasi.latitude, lokasi.longitude);
    return !paling || jarak < paling.jarak ? { lokasi, jarak: Math.round(jarak) } : paling;
  }, null);

  return {
    valid: false,
    lokasi: terdekat?.lokasi || null,
    jarak: terdekat?.jarak || null,
  };
}

module.exports = { hitungJarak, validasiLokasi };
