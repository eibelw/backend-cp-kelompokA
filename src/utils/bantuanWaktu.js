// Kumpulan fungsi pembantu untuk operasi waktu dan tanggal

function keFormatWaktu(tanggal) {
  return new Date(tanggal).toTimeString().slice(0, 5); // "HH:MM"
}

// Periksa apakah waktu sekarang masih dalam jendela absen masuk
function dalamJamAbsenMasuk() {
  const sekarang = new Date();
  const waktuSekarang = keFormatWaktu(sekarang);
  const mulai = process.env.CHECK_IN_START || '07:00';
  const akhir = process.env.CHECK_IN_END || '10:00';
  return waktuSekarang >= mulai && waktuSekarang <= akhir;
}

// Periksa apakah sudah melewati batas minimal waktu absen keluar
function setelahJamAbsenKeluar() {
  const sekarang = new Date();
  const waktuSekarang = keFormatWaktu(sekarang);
  const batasKeluar = process.env.CHECK_OUT_START || '16:00';
  return waktuSekarang >= batasKeluar;
}

// Dapatkan tanggal hari ini dalam format YYYY-MM-DD
function tanggalHariIni() {
  return new Date().toISOString().split('T')[0];
}

// Format tanggal ke teks Bahasa Indonesia, mis: "Senin, 13 Januari 2025"
function formatTanggalIndonesia(tanggal) {
  return new Date(tanggal).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format waktu ke "HH:MM:SS"
function formatWaktu(tanggal) {
  return new Date(tanggal).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

module.exports = {
  keFormatWaktu,
  dalamJamAbsenMasuk,
  setelahJamAbsenKeluar,
  tanggalHariIni,
  formatTanggalIndonesia,
  formatWaktu,
};
