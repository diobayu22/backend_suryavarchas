import express from 'express'
import { refreshToken } from '../controllers/RefreshToken.js'
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

const router = express.Router()

router.get('/users', getUsers)
router.get('/me', verifyToken, Me)
router.post('/users', Register)
router.post('/login', Login)
router.post('/logout', verifyToken, Logout)
router.put('/update', verifyToken, updateUsers)
router.delete('/delete', verifyToken, deleteUser)
router.get('/token', refreshToken)

export default router
