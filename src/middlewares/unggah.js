const multer = require("multer");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);
const BUCKET = "absensi-images";

// Filter tipe file yang diizinkan
function filterFile(tipeYangDiizinkan) {
  return (req, file, cb) => {
    if (tipeYangDiizinkan.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Tipe file tidak diizinkan. Hanya: ${tipeYangDiizinkan.join(", ")}`,
        ),
        false,
      );
    }
  };
}

// Buat middleware array: multer (memory) + upload ke Supabase Storage
function buatUnggah(namaField, subfolder, tipeYangDiizinkan) {
  const multerInstance = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
    },
    fileFilter: filterFile(tipeYangDiizinkan),
  });

  return [
    multerInstance.single(namaField),
    async (req, res, next) => {
      if (!req.file) return next();
      try {
        const ekstensi = path.extname(req.file.originalname);
        const namaFile = `${subfolder}/${Date.now()}-${Math.round(Math.random() * 1e6)}${ekstensi}`;

        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(namaFile, req.file.buffer, {
            contentType: req.file.mimetype,
          });

        if (error) return next(error);

        const { data } = supabase.storage.from(BUCKET).getPublicUrl(namaFile);
        req.file.supabaseUrl = data.publicUrl;
        req.file.supabasePath = namaFile;
        next();
      } catch (err) {
        next(err);
      }
    },
  ];
}

// Middleware upload foto selfie absensi dan foto profil
const unggahFoto = buatUnggah("foto", "selfie", [
  "image/jpeg",
  "image/jpg",
  "image/png",
]);

// Middleware upload dokumen surat keterangan izin
const unggahDokumen = buatUnggah("dokumen", "documents", [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
]);

module.exports = { unggahFoto, unggahDokumen, supabase, BUCKET };
