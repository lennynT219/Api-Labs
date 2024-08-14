import express from 'express'
import { getallTareas, getTareaById, updateTareaStatus } from '../controllers/pasanteControler.js'
import { verifyRoles, verifyToken } from '../middlewares/auth.js'

const router = express.Router()

router.get('/tareas', verifyToken, verifyRoles('Pasante'), getallTareas)
router.get('/tareas/:id', verifyToken, verifyRoles('Pasante'), getTareaById)
router.put('/tareas/:id', verifyToken, verifyRoles('Pasante'), updateTareaStatus)

export default router
