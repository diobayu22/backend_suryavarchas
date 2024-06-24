import Mobil from '../models/MobilModel.js'
import Kategori from '../models/KategoriModel.js'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'
import User from '../models/UserModel.js'

// Generate random no_id with "MVC" - number format
const generateNoId = () => {
  return `MVC-${uuidv4().split('-')[0]}` // Example: MVC-1234abcd
}

// Get all cars
export const getAllMobil = async (req, res) => {
  try {
    const mobil = await Mobil.findAll({
      include: [
        { model: Kategori, attributes: ['namakategori'] },
        {
          model: User,
          attributes: ['name', 'id'],
        },
      ],
    })
    res.status(200).json(mobil)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Get car by id
export const getMobilById = async (req, res) => {
  try {
    const mobil = await Mobil.findOne({
      where: { id: req.params.id },
      include: [
        { model: Kategori, attributes: ['namakategori'] },
        {
          model: User,
          attributes: ['name', 'id'],
        },
      ],
    })
    if (!mobil) {
      return res.status(404).json({ msg: 'Mobil tidak ditemukan' })
    }
    res.status(200).json(mobil)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

export const getMobilByUserId = async (req, res) => {
  try {
    const user_id = req.params.user_id
    const mobils = await Mobil.findAll({
      where: { user_id: user_id },
      include: [
        { model: Kategori, attributes: ['namakategori'] },
        {
          model: User,
          attributes: ['name', 'id'],
        },
      ],
    })
    if (mobils.length === 0) {
      return res
        .status(404)
        .json({ msg: 'Mobil tidak ditemukan untuk user ini' })
    }
    res.status(200).json(mobils)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Create new car
export const createMobil = async (req, res) => {
  const {
    jenis,
    merk,
    tahun,
    pajak,
    kategori_id,
    tempat_duduk,
    transmisi,
    agasi,
    bahan_bakar,
    deskripsi,
    jumlah,
    harga,
    user_id,
  } = req.body
  const no_id = generateNoId()

  let fileNames = []
  let urls = []

  if (req.files && req.files.images) {
    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images]

    files.forEach((file) => {
      const fileSize = file.size
      const ext = path.extname(file.name)
      const fileName = file.md5 + ext

      const allowedType = ['.png', '.jpg', '.jpeg']
      if (!allowedType.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: 'Invalid image type' })
      }
      if (fileSize > 5000000) {
        return res.status(422).json({ msg: 'Max image size is 5MB' })
      }

      file.mv(`./public/images/${fileName}`, (err) => {
        if (err) {
          return res.status(500).json({ msg: err.message })
        }
      })

      fileNames.push(fileName)
      urls.push(`${req.protocol}://${req.get('host')}/images/${fileName}`)
    })
  }

  try {
    const mobil = await Mobil.create({
      no_id,
      jenis,
      merk,
      tahun,
      pajak,
      images: JSON.stringify(fileNames),
      urls: JSON.stringify(urls),
      tempat_duduk,
      transmisi,
      agasi,
      bahan_bakar,
      deskripsi,
      jumlah,
      harga,
      kategori_id,
      user_id,
    })
    res.status(201).json({ msg: 'Mobil berhasil dibuat', mobil })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Update car
export const updateMobil = async (req, res) => {
  const {
    jenis,
    merk,
    tahun,
    pajak,
    kategori_id,
    tempat_duduk,
    agasi,
    transmisi,
    bahan_bakar,
    deskripsi,
    jumlah,
    harga,
    user_id,
  } = req.body

  try {
    const mobil = await Mobil.findOne({ where: { id: req.params.id } })
    if (!mobil) {
      return res.status(404).json({ msg: 'Mobil tidak ditemukan' })
    }

    let fileNames = []
    let urls = []

    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images]

      files.forEach((file) => {
        const fileSize = file.size
        const ext = path.extname(file.name)
        const fileName = file.md5 + ext

        const allowedType = ['.png', '.jpg', '.jpeg']
        if (!allowedType.includes(ext.toLowerCase())) {
          return res.status(422).json({ msg: 'Invalid image type' })
        }
        if (fileSize > 5000000) {
          return res.status(422).json({ msg: 'Max image size is 5MB' })
        }

        file.mv(`./public/images/${fileName}`, (err) => {
          if (err) {
            return res.status(500).json({ msg: err.message })
          }
        })

        fileNames.push(fileName)
        urls.push(`${req.protocol}://${req.get('host')}/images/${fileName}`)
      })
    } else {
      // If no new images, keep the existing ones
      fileNames = JSON.parse(mobil.images)
      urls = JSON.parse(mobil.urls)
    }

    mobil.jenis = jenis
    mobil.merk = merk
    mobil.tahun = tahun
    mobil.pajak = pajak
    mobil.images = JSON.stringify(fileNames)
    mobil.kategori_id = kategori_id
    mobil.urls = JSON.stringify(urls)
    mobil.tempat_duduk = tempat_duduk
    mobil.agasi = agasi
    mobil.transmisi = transmisi
    mobil.bahan_bakar = bahan_bakar
    mobil.deskripsi = deskripsi
    mobil.jumlah = jumlah
    mobil.harga = harga
    mobil.user_id = user_id
    await mobil.save()

    res.status(200).json({ msg: 'Mobil berhasil diupdate', mobil })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Delete car
export const deleteMobil = async (req, res) => {
  try {
    const mobil = await Mobil.findOne({ where: { id: req.params.id } })
    if (!mobil) {
      return res.status(404).json({ msg: 'Mobil tidak ditemukan' })
    }

    // Optionally remove the car's image
    if (mobil.image) {
      const filePath = `./public/images/${mobil.image}`
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log('Failed to remove image:', err)
        }
      })
    }

    await mobil.destroy()
    res.status(200).json({ msg: 'Mobil berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

export const updateMobilJumlah = async (req, res) => {
  const { jumlah } = req.body

  try {
    const mobil = await Mobil.findOne({ where: { id: req.params.id } })
    if (!mobil) {
      return res.status(404).json({ msg: 'Mobil tidak ditemukan' })
    }

    mobil.jumlah = jumlah

    await mobil.save()

    res.status(200).json({ msg: 'Mobil berhasil diupdate', mobil })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}
