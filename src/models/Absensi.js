const { DataTypes } = require('sequelize');

// Model tabel absensi harian pegawai
module.exports = (basisData) => {
  const Absensi = basisData.define(
    'Absensi',
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
        comment: 'Relasi ke tabel pengguna',
      },
      tanggal: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Tanggal absensi (format: YYYY-MM-DD)',
      },
      waktuMasuk: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Timestamp saat check-in',
      },
      waktuKeluar: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Timestamp saat check-out (null jika belum checkout)',
      },
      latMasuk: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false,
        comment: 'Latitude GPS saat check-in',
      },
      lngMasuk: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false,
        comment: 'Longitude GPS saat check-in',
      },
      latKeluar: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
        comment: 'Latitude GPS saat check-out',
      },
      lngKeluar: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
        comment: 'Longitude GPS saat check-out',
      },
      urlFoto: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Path foto selfie pegawai saat check-in',
      },
      keterlambatan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Durasi keterlambatan dalam menit (0 = tepat waktu)',
      },
      status: {
        type: DataTypes.ENUM('hadir', 'izin', 'sakit', 'alpa', 'cuti'),
        allowNull: false,
        defaultValue: 'hadir',
        comment: 'Status kehadiran pegawai pada hari tersebut',
      },
      catatan: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Keterangan tambahan (opsional)',
      },
    },
    {
      tableName: 'absensi',
      indexes: [
        // Satu pegawai hanya boleh absen sekali per hari
        { unique: true, fields: ['id_pengguna', 'tanggal'] },
        { fields: ['tanggal'] },
        { fields: ['status'] },
      ],
    }
  );

  Absensi.kaitkan = (model) => {
    Absensi.belongsTo(model.Pengguna, { foreignKey: 'idPengguna', as: 'pengguna' });
  };

  return Absensi;
};
