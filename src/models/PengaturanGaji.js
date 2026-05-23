const { DataTypes } = require('sequelize');

module.exports = (basisData) => {
  const PengaturanGaji = basisData.define(
    'PengaturanGaji',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      idPengguna: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'pengguna', key: 'id' },
        comment: 'NULL = berlaku global, diisi = khusus pegawai ini',
      },
      gajiPokok: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        comment: 'Gaji pokok bulanan (rupiah)',
      },
      tunjanganKehadiran: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Tunjangan kehadiran penuh per bulan (rupiah)',
      },
      potonganPerJamTerlambat: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Potongan per jam keterlambatan (rupiah)',
      },
      potonganPerHariCuti: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
        comment: 'Potongan per hari cuti (rupiah)',
      },
      berlakuMulai: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Tanggal mulai berlaku pengaturan gaji ini',
      },
      aktif: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Nonaktifkan tanpa menghapus data historis',
      },
      dibuatOleh: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'pengguna', key: 'id' },
      },
    },
    {
      tableName: 'pengaturan_gaji',
      indexes: [
        { fields: ['berlaku_mulai'] },
        { fields: ['id_pengguna'] },
      ],
    }
  );

  PengaturanGaji.kaitkan = (model) => {
    PengaturanGaji.belongsTo(model.Pengguna, { foreignKey: 'dibuatOleh', as: 'pembuat' });
    PengaturanGaji.belongsTo(model.Pengguna, { foreignKey: 'idPengguna', as: 'pegawai' });
  };

  return PengaturanGaji;
};
