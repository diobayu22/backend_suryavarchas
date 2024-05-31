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
router.get('/users', getUsers)
router.get('/me', verifyToken, Me)
router.post('/users', Register)
router.post('/login', Login)
router.post('/logout', verifyToken, Logout)
router.put('/update/:id', verifyToken, updateUsers)
router.delete('/delete', verifyToken, deleteUser)

// sopir
router.post('/sopir', createSopir)
router.get('/sopir', getAllSopir)
router.get('/sopir/:id', getSopirById)
router.put('/sopir/:id', updateSopir)
router.delete('/sopir/:id', deleteSopir)

export default router
