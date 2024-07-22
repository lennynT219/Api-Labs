import express from 'express'
import { getallTareas, getTareaById, updateTareaStatus } from '../controllers/pasanteControler.js'
import { verifyRoles, verifyToken } from '../middlewares/auth.js'

const router = express.Router()

router.get('/tareas', verifyToken, verifyRoles('pasante'), getallTareas)
router.get('/tareas/:id', verifyToken, verifyRoles('pasante'), getTareaById)
router.put('/tareas/:id', verifyToken, verifyRoles('pasante'), updateTareaStatus)

export default router
