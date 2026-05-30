const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const semuaRute = require('../routes');
const penangananKesalahan = require('../middlewares/penangananKesalahan');

const aplikasi = express();

// Keamanan HTTP headers
aplikasi.use(helmet());

// Izinkan permintaan lintas domain dari frontend
aplikasi.use(cors({
  origin: [
    'https://absensi-frontend.vercel.app',
    'http://localhost:5173',
    'http://localhost:8100',
  ],
  credentials: true,
}));

// Log permintaan HTTP
aplikasi.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Parsing body JSON dan form
aplikasi.use(express.json());
aplikasi.use(express.urlencoded({ extended: true }));

// Sajikan file statis (foto absensi dan dokumen izin)
aplikasi.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Daftarkan semua rute API
aplikasi.use('/api/v1', semuaRute);

// Cek kesehatan server
aplikasi.get('/health', (req, res) => {
  res.json({ status: 'OK', waktu: new Date().toISOString() });
});

// Tangani rute yang tidak ditemukan
aplikasi.use((req, res) => {
  res.status(404).json({ success: false, status: 404, message: 'Rute tidak ditemukan' });
});

// Penanganan kesalahan terpusat
aplikasi.use(penangananKesalahan);

module.exports = aplikasi;
