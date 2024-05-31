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
router.post('/sopir', createSopir) // done
router.get('/sopir', getAllSopir) // done
router.get('/sopir/:id', getSopirById) // done
router.put('/sopir/:id', updateSopir) //done
router.delete('/sopir/:id', deleteSopir) //done

export default router
