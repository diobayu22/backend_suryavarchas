import Mobil from '../models/MobilModel.js'
import Kategori from '../models/KategoriModel.js'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'

// Generate random no_id with "MVC" - number format
const generateNoId = () => {
  return `MVC-${uuidv4().split('-')[0]}` // Example: MVC-1234abcd
}

// Get all cars
export const getAllMobil = async (req, res) => {
  try {
    const mobil = await Mobil.findAll({
      include: {
        model: Kategori,
        attributes: ['namakategori'],
      },
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
      include: {
        model: Kategori,
        attributes: ['namakategori'],
      },
    })
    if (!mobil) {
      return res.status(404).json({ msg: 'Mobil tidak ditemukan' })
    }
    res.status(200).json(mobil)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Create new car
export const createMobil = async (req, res) => {
  const { jenis, merk, tahun, pajak, kategori_id } = req.body
  const no_id = generateNoId()
  let fileName = ''

  // Check if a file is uploaded
  if (req.files && req.files.image) {
    const file = req.files.image
    const fileSize = file.size
    const ext = path.extname(file.name)
    fileName = file.md5 + ext

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
  }

  try {
    const mobil = await Mobil.create({
      no_id,
      jenis,
      merk,
      tahun,
      pajak,
      image: fileName,
      kategori_id,
    })
    res.status(201).json({ msg: 'Mobil berhasil dibuat', mobil })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Update car
export const updateMobil = async (req, res) => {
  const { jenis, merk, tahun, pajak, kategori_id } = req.body
  try {
    const mobil = await Mobil.findOne({ where: { id: req.params.id } })
    if (!mobil) {
      return res.status(404).json({ msg: 'Mobil tidak ditemukan' })
    }

    let fileName = mobil.image

    // Check if a new file is uploaded
    if (req.files && req.files.image) {
      const file = req.files.image
      const fileSize = file.size
      const ext = path.extname(file.name)
      fileName = file.md5 + ext

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
    }

    mobil.jenis = jenis
    mobil.merk = merk
    mobil.tahun = tahun
    mobil.pajak = pajak
    mobil.image = fileName
    mobil.kategori_id = kategori_id
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
