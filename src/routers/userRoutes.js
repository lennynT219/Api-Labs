import express from 'express'
import { register, login, createQueja, getAllQuejas, confirmarEmail } from '../controllers/userControler.js'
import { verifyRoles, verifyToken } from '../middlewares/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/quejas', verifyToken, verifyRoles('estudiante', 'docente'), createQueja)
router.get('/quejas', verifyToken, verifyRoles('estudiante', 'docente'), getAllQuejas)
router.get('/confirmar/:token', confirmarEmail)

export default router
