import Kategori from '../models/KategoriModel.js'

// Get all categories
export const getAllKategori = async (req, res) => {
  try {
    const kategori = await Kategori.findAll()
    res.status(200).json(kategori)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Get category by id
export const getKategoriById = async (req, res) => {
  try {
    const kategori = await Kategori.findOne({
      where: { id: req.params.id },
    })
    if (!kategori) {
      return res.status(404).json({ msg: 'Kategori tidak ditemukan' })
    }
    res.status(200).json(kategori)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Create new category
export const createKategori = async (req, res) => {
  const { namakategori } = req.body
  try {
    const kategori = await Kategori.create({ namakategori })
    res.status(201).json({ msg: 'Kategori berhasil dibuat', kategori })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Update category
export const updateKategori = async (req, res) => {
  const { namakategori } = req.body
  try {
    const kategori = await Kategori.findOne({ where: { id: req.params.id } })
    if (!kategori) {
      return res.status(404).json({ msg: 'Kategori tidak ditemukan' })
    }
    kategori.namakategori = namakategori
    await kategori.save()
    res.status(200).json({ msg: 'Kategori berhasil diupdate', kategori })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

// Delete category
export const deleteKategori = async (req, res) => {
  try {
    const kategori = await Kategori.findOne({ where: { id: req.params.id } })
    if (!kategori) {
      return res.status(404).json({ msg: 'Kategori tidak ditemukan' })
    }
    await kategori.destroy()
    res.status(200).json({ msg: 'Kategori berhasil dihapus' })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}
