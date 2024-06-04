import Sopir from '../models/SopirModel.js'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'
// Create a new sopir
export const createSopir = async (req, res) => {
  const { nama, no_telp, alamat } = req.body

  // Generate random no_id
  const no_id = `VC-${uuidv4().slice(0, 8)}`

  let fileName = ''

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

  try {
    const newSopir = await Sopir.create({
      no_id,
      nama,
      no_telp,
      alamat,
      image: fileName,
      url: url,
    })
    res.status(201).json(newSopir)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ msg: error.message })
  }
}

// Get all sopir
export const getAllSopir = async (req, res) => {
  try {
    const sopirs = await Sopir.findAll()
    res.status(200).json(sopirs)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ msg: error.message })
  }
}

// Get a single sopir by ID
export const getSopirById = async (req, res) => {
  try {
    const sopir = await Sopir.findOne({
      where: {
        id: req.params.id,
      },
    })

    if (!sopir) {
      return res.status(404).json({ msg: 'Sopir not found' })
    }

    res.status(200).json(sopir)
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ msg: error.message })
  }
}

// Update a sopir by ID
export const updateSopir = async (req, res) => {
  try {
    const sopir = await Sopir.findOne({
      where: {
        id: req.params.id,
      },
    })

    if (!sopir) {
      return res.status(404).json({ msg: 'Sopir not found' })
    }

    let fileName = sopir.image

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

    const { nama, no_telp, alamat } = req.body

    await sopir.update({
      nama,
      no_telp,
      alamat,
      image: fileName,
      url: url,
    })

    res.status(200).json({ msg: 'Sopir updated successfully' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ msg: error.message })
  }
}

// Delete a sopir by ID
export const deleteSopir = async (req, res) => {
  try {
    const sopir = await Sopir.findOne({
      where: {
        id: req.params.id,
      },
    })

    if (!sopir) {
      return res.status(404).json({ msg: 'Sopir not found' })
    }

    await sopir.destroy()
    res.status(200).json({ msg: 'Sopir deleted successfully' })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ msg: error.message })
  }
}
