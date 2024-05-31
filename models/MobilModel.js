import { Sequelize } from 'sequelize'
import db from '../config/Database.js'
import Kategori from './Kategori.js'

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
    image: {
      type: DataTypes.STRING(255),
    },
    kategori_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Kategori,
        key: 'id',
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  },
)

export default Mobil

;(async () => {
  await db.sync()
})()
