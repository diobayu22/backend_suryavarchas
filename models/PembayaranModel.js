import { Sequelize } from 'sequelize'
import db from '../config/Database.js'

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
      allowNull: false,
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
    status: {
      type: DataTypes.STRING(50),
    },
    image: {
      type: DataTypes.STRING(255),
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  },
)

export default Pembayaran

;(async () => {
  await db.sync()
})()
