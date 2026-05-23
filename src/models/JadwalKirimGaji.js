const { DataTypes } = require('sequelize');

module.exports = (basisData) => {
  const JadwalKirimGaji = basisData.define(
    'JadwalKirimGaji',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      tanggalKirim: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 28 },
        comment: 'Tanggal dalam bulan (1–28) untuk kirim slip otomatis',
      },
      aktif: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      dibuatOleh: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'pengguna', key: 'id' },
      },
    },
    { tableName: 'jadwal_kirim_gaji' }
  );

  JadwalKirimGaji.kaitkan = (model) => {
    JadwalKirimGaji.belongsTo(model.Pengguna, { foreignKey: 'dibuatOleh', as: 'pembuat' });
  };

  return JadwalKirimGaji;
};
