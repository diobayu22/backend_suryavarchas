import { Sequelize } from 'sequelize'
import db from '../config/Database.js'
import Sopir from './SopirModel.js'
import Mobil from './MobilModel.js'
import User from './UserModel.js'

const { DataTypes } = Sequelize

const Pembayaran = db.define(
  'pembayaran',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tipe_identitas: {
      type: DataTypes.STRING(50),
    },
    no_identitas: {
      type: DataTypes.STRING(50),
    },
    nama: {
      type: DataTypes.STRING(100),
    },
    no_telp: {
      type: DataTypes.STRING(15),
    },
    alamat: {
      type: DataTypes.TEXT,
    },
    kota: {
      type: DataTypes.STRING(50),
    },
    plokasi: {
      type: DataTypes.TEXT,
    },
    ptanggal: {
      type: DataTypes.DATE,
    },
    pwaktu: {
      type: DataTypes.TIME,
    },
    klokasi: {
      type: DataTypes.TEXT,
    },
    ktanggal: {
      type: DataTypes.DATE,
    },
    kwaktu: {
      type: DataTypes.TIME,
    },
    kategori: {
      type: DataTypes.STRING(50),
    },
    total: {
      type: DataTypes.STRING(50),
    },
    status: {
      type: DataTypes.STRING(50),
    },
    image: {
      type: DataTypes.STRING(255),
    },
    metode: {
      type: DataTypes.STRING(255),
    },
    url: {
      type: DataTypes.STRING(255),
    },
    sopir_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'sopir', // Nama model Sopir
        key: 'id',
      },
    },
    mobil_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'mobil', // Nama model Mobil
        key: 'id',
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user', // Nama model User
        key: 'id',
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  },
)

// Definisikan relasi
Pembayaran.belongsTo(Sopir, { foreignKey: 'sopir_id' })
Pembayaran.belongsTo(Mobil, { foreignKey: 'mobil_id' })
Pembayaran.belongsTo(User, { foreignKey: 'user_id' })

export default Pembayaran
;(async () => {
  await db.sync()
})()
