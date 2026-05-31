// Kumpulan fungsi pembantu untuk operasi waktu dan tanggal
// Semua fungsi berbasis waktu selalu menggunakan timezone Asia/Jakarta (WIB)

const TZ = 'Asia/Jakarta';

// Ambil jam dan menit sekarang dalam WIB sebagai string "HH:MM"
function jamWIBSekarang() {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date()).replace(/^24/, '00'); // Intl kadang return "24:xx"
}

// Periksa apakah waktu sekarang masih dalam jendela absen masuk (WIB)
function dalamJamAbsenMasuk() {
  const waktu = jamWIBSekarang();
  const mulai = process.env.CHECK_IN_START || '07:00';
  const akhir = process.env.CHECK_IN_END || '10:00';
  return waktu >= mulai && waktu <= akhir;
}

// Periksa apakah sudah melewati batas minimal waktu absen keluar (WIB)
function setelahJamAbsenKeluar() {
  const waktu = jamWIBSekarang();
  const batasKeluar = process.env.CHECK_OUT_START || '16:00';
  return waktu >= batasKeluar;
}

// Dapatkan tanggal hari ini dalam WIB format YYYY-MM-DD
function tanggalHariIni() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TZ }).format(new Date()); // en-CA → YYYY-MM-DD
}

// Format tanggal ke teks Bahasa Indonesia, mis: "Senin, 13 Januari 2025"
function formatTanggalIndonesia(tanggal) {
  return new Date(tanggal).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: TZ,
  });
}

// Format waktu ke "HH:MM:SS" dalam WIB
function formatWaktu(tanggal) {
  return new Date(tanggal).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: TZ,
  });
}

module.exports = {
  jamWIBSekarang,
  dalamJamAbsenMasuk,
  setelahJamAbsenKeluar,
  tanggalHariIni,
  formatTanggalIndonesia,
  formatWaktu,
};
