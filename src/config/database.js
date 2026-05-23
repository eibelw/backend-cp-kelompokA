const { Sequelize } = require('sequelize');

// SQLite in-memory: tidak perlu PostgreSQL, data hilang saat server restart
const basisData = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

module.exports = basisData;
