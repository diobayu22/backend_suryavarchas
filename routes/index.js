import express from 'express'
import {
  getUsers,
  Login,
  Logout,
  Me,
  nePassword,
  Register,
  resetPassword,
  updateUsers,
  deleteUser,
  getUSerById,
  updateUsersWithToken,
} from '../controllers/Users.js'
import { verifyToken } from '../middleware/VerifyToken.js'
import {
  createSopir,
  getAllSopir,
  getSopirById,
  updateSopir,
  deleteSopir,
} from '../controllers/Sopirs.js'
import {
  getAllKategori,
  getKategoriById,
  createKategori,
  updateKategori,
  deleteKategori,
} from '../controllers/Kategoris.js'
import {
  getAllMobil,
  getMobilById,
  createMobil,
  updateMobil,
  deleteMobil,
} from '../controllers/Mobils.js'
import {
  createPembayaran,
  updatePembayaran,
  deletePembayaran,
  getAllPembayaran,
  getPembayaranById,
  updatePembayaranStatus,
} from '../controllers/Pembayarans.js'
const router = express.Router()

// users
router.get('/users', getUsers) // done
router.get('/me', verifyToken, Me) // done
router.post('/users', Register) // done
router.post('/login', Login) // done
router.post('/logout', verifyToken, Logout) // done
router.put('/update/:id', verifyToken, updateUsersWithToken) // done
router.put('/updatenotoken/:id', updateUsers) // done
router.delete('/delete', verifyToken, deleteUser)
router.get('/users/:id', getUSerById) // done
// sopir
router.post('/sopir', createSopir) // done
router.get('/sopir', getAllSopir) // done
router.get('/sopir/:id', getSopirById) // done
router.put('/sopir/:id', updateSopir) //done
router.delete('/sopir/:id', deleteSopir) //done

// kategori
router.get('/kategori', getAllKategori) // done
router.get('/kategori/:id', getKategoriById) // done
router.post('/kategori', createKategori) // done
router.put('/kategori/:id', updateKategori) // done
router.delete('/kategori/:id', deleteKategori) // done

// mobil
router.get('/mobil', getAllMobil) // done
router.get('/mobil/:id', getMobilById) // done
router.post('/mobil', createMobil) // done
router.put('/mobil/:id', updateMobil) // done
router.delete('/mobil/:id', deleteMobil) // done

// pembayaran
router.post('/pembayaran', createPembayaran) // done
router.put('/pembayaran/:id', updatePembayaran) // done
router.put('/pembayaran/:id/status', updatePembayaranStatus)
router.delete('/pembayaran/:id', deletePembayaran) // done
router.get('/pembayaran', getAllPembayaran) // done
router.get('/pembayaran/:id', getPembayaranById) // done

export default router
