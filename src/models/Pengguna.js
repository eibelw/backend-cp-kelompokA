const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

// Model tabel pengguna (karyawan & admin sistem)
module.exports = (basisData) => {
  const Pengguna = basisData.define(
    'Pengguna',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        comment: 'Kunci utama unik',
      },
      idPegawai: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: 'Nomor induk pegawai (unik)',
      },
      nama: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: 'Nama lengkap pegawai',
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        validate: { isEmail: true },
        comment: 'Alamat email (digunakan untuk login)',
      },
      kataSandi: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Kata sandi terenkripsi (bcrypt)',
      },
      peran: {
        type: DataTypes.ENUM('admin', 'pegawai'),
        allowNull: false,
        defaultValue: 'pegawai',
        comment: 'Hak akses: admin atau pegawai',
      },
      departemen: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Nama departemen/divisi',
      },
      jabatan: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: 'Nama jabatan atau posisi',
      },
      telepon: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: 'Nomor telepon pegawai',
      },
      jenisKelamin: {
        type: DataTypes.ENUM('laki-laki', 'perempuan'),
        allowNull: true,
        comment: 'Jenis kelamin pegawai',
      },
      urlFoto: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Path foto profil pegawai',
      },
      aktif: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Status aktif akun (false = dinonaktifkan)',
      },
    },
    {
      tableName: 'pengguna',
      indexes: [
        { unique: true, fields: ['id_pegawai'] },
        { unique: true, fields: ['email'] },
      ],
      hooks: {
        beforeCreate: async (pengguna) => {
          pengguna.kataSandi = await bcrypt.hash(pengguna.kataSandi, 12);
        },
        beforeUpdate: async (pengguna) => {
          if (pengguna.changed('kataSandi')) {
            pengguna.kataSandi = await bcrypt.hash(pengguna.kataSandi, 12);
          }
        },
      },
    }
  );

  // Bandingkan kata sandi input dengan hash yang tersimpan
  Pengguna.prototype.validasiKataSandi = async function (kataSandiInput) {
    return bcrypt.compare(kataSandiInput, this.kataSandi);
  };

  // Kembalikan data pengguna tanpa kata sandi (aman untuk response API)
  Pengguna.prototype.keJSONAman = function () {
    const data = { ...this.get() };
    delete data.kataSandi;
    return data;
  };

  Pengguna.kaitkan = (model) => {
    Pengguna.hasMany(model.Absensi, { foreignKey: 'idPengguna', as: 'dataAbsensi' });
    Pengguna.hasMany(model.Izin, { foreignKey: 'idPengguna', as: 'dataIzin' });
    Pengguna.hasMany(model.Izin, { foreignKey: 'disetujuiOleh', as: 'izinYangDisetujui' });
  };

  return Pengguna;
};
