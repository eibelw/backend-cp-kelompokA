const { Sequelize } = require('sequelize');
// Import eksplisit agar bundler Vercel menyertakan pg dalam deployment
require('pg');

// Konfigurasi koneksi ke database PostgreSQL
const basisData = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5433,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,        // koneksi maksimal dalam pool
      min: 0,         // koneksi minimal dalam pool
      acquire: 30000, // batas waktu mendapatkan koneksi (ms)
      idle: 10000,    // batas waktu koneksi idle sebelum dilepas (ms)
    },
    define: {
      timestamps: true,
      underscored: true, // camelCase JS → snake_case kolom database otomatis
    },
  }
);

module.exports = basisData;
