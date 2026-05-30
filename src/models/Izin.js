const { DataTypes } = require('sequelize');

// Model tabel pengajuan izin dan sakit pegawai
module.exports = (basisData) => {
  const Izin = basisData.define(
    'Izin',
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
        comment: 'Pegawai yang mengajukan izin',
      },
      jenisIzin: {
        type: DataTypes.ENUM('izin', 'sakit', 'cuti'),
        allowNull: false,
        comment: 'Jenis pengajuan: izin biasa, sakit, atau cuti',
      },
      tanggalMulai: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Tanggal mulai izin',
      },
      tanggalSelesai: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Tanggal selesai izin',
      },
      alasan: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Alasan pengajuan izin',
      },
      status: {
        type: DataTypes.ENUM('menunggu', 'disetujui', 'ditolak'),
        allowNull: false,
        defaultValue: 'menunggu',
        comment: 'Status persetujuan: menunggu / disetujui / ditolak',
      },
      disetujuiOleh: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'pengguna', key: 'id' },
        comment: 'Admin yang menyetujui atau menolak izin',
      },
      urlDokumen: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Path file surat keterangan (opsional)',
      },
    },
    {
      tableName: 'izin',
      indexes: [
        { fields: ['id_pengguna'] },
        { fields: ['status'] },
        { fields: ['tanggal_mulai', 'tanggal_selesai'] },
      ],
    }
  );

  Izin.kaitkan = (model) => {
    Izin.belongsTo(model.Pengguna, { foreignKey: 'idPengguna', as: 'pengguna' });
    Izin.belongsTo(model.Pengguna, { foreignKey: 'disetujuiOleh', as: 'penyetuju' });
  };

  return Izin;
};
