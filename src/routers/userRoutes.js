import express from 'express'
import {
  register,
  login,
  pefil,
  createQueja,
  getAllQuejas,
  confirmarEmail,
  updateUser
} from '../controllers/userControler.js'
import { verifyRoles, verifyToken } from '../middlewares/auth.js'

const router = express.Router()

router.post('/registro', register)
router.post('/login', login)
router.post('/quejas', verifyToken, verifyRoles('Estudiante', 'Docente', 'Pasante'), createQueja)
router.get('/quejas', verifyToken, verifyRoles('Estudiante', 'Docente', 'Pasante'), getAllQuejas)
router.get('/confirmar/:token', confirmarEmail)
router.get('/perfil', verifyToken, pefil)
router.put('/perfil', verifyToken, updateUser)

export default router
