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
} from '../controllers/Users.js'
import { verifyToken } from '../middleware/VerifyToken.js'
import {
  createSopir,
  getAllSopir,
  getSopirById,
  updateSopir,
  deleteSopir,
} from '../controllers/Sopirs.js'

const router = express.Router()

// users
router.get('/users', getUsers) // done
router.get('/me', verifyToken, Me) // done
router.post('/users', Register) // done
router.post('/login', Login) // done
router.post('/logout', verifyToken, Logout) // done
router.put('/update/:id', verifyToken, updateUsers) // done
router.delete('/delete', verifyToken, deleteUser)

// sopir
router.post('/sopir', createSopir)
router.get('/sopir', getAllSopir)
router.get('/sopir/:id', getSopirById)
router.put('/sopir/:id', updateSopir)
router.delete('/sopir/:id', deleteSopir)

export default router
