const { DataTypes } = require('sequelize');

module.exports = (basisData) => {
  const SlipGaji = basisData.define(
    'SlipGaji',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      idPengguna: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'pengguna', key: 'id' },
      },
      bulan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 12 },
        comment: 'Bulan slip gaji (1-12)',
      },
      tahun: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Tahun slip gaji',
      },
      gajiPokok: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      tunjanganKehadiran: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      totalPotonganKeterlambatan: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      totalPotonganCuti: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
      },
      totalGaji: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },
      jumlahHadir: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      totalMenitTerlambat: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      jumlahHariCuti: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM('draft', 'final'),
        allowNull: false,
        defaultValue: 'draft',
      },
      dibuatOleh: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'pengguna', key: 'id' },
      },
    },
    {
      tableName: 'slip_gaji',
      indexes: [
        { unique: true, fields: ['id_pengguna', 'bulan', 'tahun'] },
        { fields: ['bulan', 'tahun'] },
        { fields: ['status'] },
      ],
    }
  );

  SlipGaji.kaitkan = (model) => {
    SlipGaji.belongsTo(model.Pengguna, { foreignKey: 'idPengguna', as: 'pengguna' });
    SlipGaji.belongsTo(model.Pengguna, { foreignKey: 'dibuatOleh', as: 'pembuat' });
  };

  return SlipGaji;
};
