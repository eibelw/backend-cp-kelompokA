const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Buat konfigurasi penyimpanan file berdasarkan subfolder tujuan
function buatPenyimpanan(subFolder) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const direktori = path.join(
        process.cwd(),
        process.env.UPLOAD_DIR || 'uploads',
        subFolder
      );
      if (!fs.existsSync(direktori)) fs.mkdirSync(direktori, { recursive: true });
      cb(null, direktori);
    },
    filename: (req, file, cb) => {
      const ekstensi = path.extname(file.originalname);
      const namaUnik = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ekstensi}`;
      cb(null, namaUnik);
    },
  });
}

// Filter tipe file yang diizinkan
function filterFile(tipeYangDiizinkan) {
  return (req, file, cb) => {
    if (tipeYangDiizinkan.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipe file tidak diizinkan. Hanya: ${tipeYangDiizinkan.join(', ')}`), false);
    }
  };
}

// Konfigurasi upload foto selfie absensi
const unggahFoto = multer({
  storage: buatPenyimpanan('photos'),
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
  fileFilter: filterFile(['image/jpeg', 'image/jpg', 'image/png']),
});

// Konfigurasi upload dokumen surat keterangan izin
const unggahDokumen = multer({
  storage: buatPenyimpanan('documents'),
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
  fileFilter: filterFile(['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']),
});

module.exports = { unggahFoto, unggahDokumen };
