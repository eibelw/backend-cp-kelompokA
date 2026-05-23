const { ValidationError, UniqueConstraintError } = require('sequelize');

// Penanganan kesalahan terpusat untuk semua route aplikasi
function penangananKesalahan(err, req, res, berikutnya) {
  console.error(`[KESALAHAN] ${err.message}`, err.stack);

  // Kesalahan validasi dari Sequelize
  if (err instanceof ValidationError || err instanceof UniqueConstraintError) {
    const daftarKesalahan = err.errors.map((e) => e.message);
    return res.status(400).json({
      success: false,
      status: 400,
      message: 'Kesalahan validasi data',
      errorMessage: daftarKesalahan.join(', '),
    });
  }

  // Kesalahan dari Multer (upload file)
  if (err.name === 'MulterError' || (err.message && err.message.includes('Tipe file tidak diizinkan'))) {
    return res.status(400).json({
      success: false,
      status: 400,
      message: err.message,
    });
  }

  const status = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && status === 500
      ? 'Terjadi kesalahan pada server'
      : err.message;

  return res.status(status).json({ success: false, status, message });
}

module.exports = penangananKesalahan;
