import fs from 'fs'
import path from 'path'
import Pembayaran from '../models/PembayaranModel.js'
import Sopir from '../models/SopirModel.js'
import Mobil from '../models/MobilModel.js'
import User from '../models/UserModel.js'

// Get all payments with related data
export const getAllPembayaran = async (req, res) => {
  try {
    const pembayaran = await Pembayaran.findAll({
      include: [
        {
          model: Sopir,
          attributes: ['id', 'nama', 'no_telp'],
        },
        {
          model: Mobil,
          attributes: ['id', 'jenis', 'merk'],
        },
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    })
    res.status(200).json(pembayaran)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Get payment by ID with related data
export const getPembayaranById = async (req, res) => {
  try {
    const pembayaran = await Pembayaran.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Sopir,
          attributes: ['id', 'nama', 'no_telp'],
        },
        {
          model: Mobil,
          attributes: ['id', 'jenis', 'merk'],
        },
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    })
    if (!pembayaran) {
      return res.status(404).json({ msg: 'Pembayaran tidak ditemukan' })
    }
    res.status(200).json(pembayaran)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Create new payment
export const createPembayaran = async (req, res) => {
  const {
    tipe_identitas,
    no_identitas,
    nama,
    no_telp,
    alamat,
    kota,
    plokasi,
    ptanggal,
    pwaktu,
    klokasi,
    ktanggal,
    kwaktu,
    kategori,
    total,
    sopir_id,
    mobil_id,
    user_id,
  } = req.body
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

  const url = `${req.protocol}://${req.get('host')}/images/${fileName}`

  try {
    const pembayaran = await Pembayaran.create({
      tipe_identitas,
      no_identitas,
      nama,
      no_telp,
      alamat,
      kota,
      plokasi,
      ptanggal,
      pwaktu,
      klokasi,
      ktanggal,
      kwaktu,
      kategori,
      total,
      status: 'Pending', // Set default status to "Pending"
      image: fileName,
      sopir_id: sopir_id || null,
      mobil_id,
      user_id,
      url: url,
    })
    res.status(201).json({ msg: 'Pembayaran berhasil dibuat', pembayaran })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Update payment
export const updatePembayaran = async (req, res) => {
  const {
    tipe_identitas,
    no_identitas,
    nama,
    no_telp,
    alamat,
    kota,
    plokasi,
    ptanggal,
    pwaktu,
    klokasi,
    ktanggal,
    kwaktu,
    kategori,
    total,
    status,
    sopir_id,
    mobil_id,
    user_id,
  } = req.body
  try {
    const pembayaran = await Pembayaran.findOne({
      where: { id: req.params.id },
    })
    if (!pembayaran) {
      return res.status(404).json({ msg: 'Pembayaran tidak ditemukan' })
    }

    let fileName = pembayaran.image

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

    const url = `${req.protocol}://${req.get('host')}/images/${fileName}`

    pembayaran.tipe_identitas = tipe_identitas
    pembayaran.no_identitas = no_identitas
    pembayaran.nama = nama
    pembayaran.no_telp = no_telp
    pembayaran.alamat = alamat
    pembayaran.kota = kota
    pembayaran.plokasi = plokasi
    pembayaran.ptanggal = ptanggal
    pembayaran.pwaktu = pwaktu
    pembayaran.klokasi = klokasi
    pembayaran.ktanggal = ktanggal
    pembayaran.kwaktu = kwaktu
    pembayaran.kategori = kategori
    pembayaran.total = total
    pembayaran.status = status
    pembayaran.image = fileName
    pembayaran.sopir_id = sopir_id || null
    pembayaran.mobil_id = mobil_id
    pembayaran.user_id = user_id
    pembayaran.url = url
    await pembayaran.save()
    res.status(200).json({ msg: 'Pembayaran berhasil diupdate', pembayaran })
  } catch (error) {
    res.status(500).json({ msg: error.message, data: 'error gagal nih' })
  }
}

// Update payment status only
export const updatePembayaranStatus = async (req, res) => {
  const { status } = req.body
  try {
    const pembayaran = await Pembayaran.findOne({
      where: { id: req.params.id },
    })
    if (!pembayaran) {
      return res.status(404).json({ msg: 'Pembayaran tidak ditemukan' })
    }

    pembayaran.status = status
    await pembayaran.save()
    res
      .status(200)
      .json({ msg: 'Status pembayaran berhasil diupdate', pembayaran })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Delete payment
export const deletePembayaran = async (req, res) => {
  try {
    const pembayaran = await Pembayaran.findOne({
      where: { id: req.params.id },
    })
    if (!pembayaran) {
      return res.status(404).json({ msg: 'Pembayaran tidak ditemukan' })
    }

    // Optionally remove the payment's image
    if (pembayaran.image) {
      const filePath = `./public/images/${pembayaran.image}`
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log('Failed to remove image:', err)
        }
      })
    }

    await pembayaran.destroy()
    res.status(200).json({ msg: 'Pembayaran berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}
