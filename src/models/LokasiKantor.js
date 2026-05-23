const { DataTypes } = require('sequelize');

// Model tabel lokasi kantor untuk validasi GPS absensi
module.exports = (basisData) => {
  const LokasiKantor = basisData.define(
    'LokasiKantor',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      kode: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        comment: 'Kode unik lokasi, dipakai sebagai prefix ID pegawai (mis: PUSAT)',
      },
      nama: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nama lokasi kantor (mis: Kantor Pusat)',
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
        comment: 'Koordinat lintang (latitude) kantor',
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
        comment: 'Koordinat bujur (longitude) kantor',
      },
      radius: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
        comment: 'Radius area valid dalam meter',
      },
      aktif: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Status aktif lokasi (false = tidak digunakan)',
      },
    },
    {
      tableName: 'lokasi_kantor',
    }
  );

  return LokasiKantor;
};
