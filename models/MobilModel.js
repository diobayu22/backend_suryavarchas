import { Sequelize } from 'sequelize'
import db from '../config/Database.js'
import Kategori from './KategoriModel.js'
import User from './UserModel.js' // Import model User

const { DataTypes } = Sequelize

const Mobil = db.define(
  'mobil',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    no_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    jenis: {
      type: DataTypes.STRING(50),
    },
    merk: {
      type: DataTypes.STRING(50),
    },
    tahun: {
      type: DataTypes.INTEGER,
    },
    pajak: {
      type: DataTypes.DATE,
    },
    images: {
      type: DataTypes.TEXT,
    },
    urls: {
      type: DataTypes.TEXT,
    },
    tempat_duduk: {
      type: DataTypes.INTEGER,
    },
    transmisi: {
      type: DataTypes.STRING(50),
    },
    bahan_bakar: {
      type: DataTypes.STRING(50),
    },
    agasi: {
      type: DataTypes.STRING(50),
    },
    deskripsi: {
      type: DataTypes.TEXT,
    },
    jumlah: {
      type: DataTypes.INTEGER,
    },
    harga: {
      type: DataTypes.FLOAT,
    },
    kategori_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Kategori,
        key: 'id',
      },
    },
    user_id: {
      // Foreign key to User table
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  },
)

Kategori.hasMany(Mobil, { foreignKey: 'kategori_id' })
Mobil.belongsTo(Kategori, { foreignKey: 'kategori_id' })

User.hasMany(Mobil, { foreignKey: 'user_id' })
Mobil.belongsTo(User, { foreignKey: 'user_id' })

export default Mobil
;(async () => {
  await db.sync()
})()
