const { Sequelize } = require('sequelize');
// Import eksplisit agar bundler Vercel menyertakan pg dalam deployment
require('pg');

let basisData;

if (process.env.DATABASE_URL) {
  // Koneksi via Transaction Pooler URL (untuk Vercel/serverless)
  basisData = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    timezone: '+00:00', // simpan & baca timestamp selalu sebagai UTC
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      useUTC: true, // pg driver: parse timestamp sebagai UTC
    },
    pool: {
      max: 3,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  });
} else {
  // Koneksi via variabel individual (untuk development lokal)
  basisData = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      timezone: '+00:00',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      dialectOptions: {
        useUTC: true,
      },
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        timestamps: true,
        underscored: true,
      },
    }
  );
}

module.exports = basisData;
