import express from 'express'
import {
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getAllQuejas,
  getQuejasById,
  updateQuejasStatus,
  createTarea,
  getAllTareas,
  getTareaById,
  updateTareaStatus,
  getTareaOfQueja,
  getAllPasante
} from '../controllers/adminController.js'
import { verifyRoles, verifyToken } from '../middlewares/auth.js'

const router = express.Router()

router.get('/users', verifyToken, verifyRoles('Admin'), getAllUsers)
router.post('/users', verifyToken, verifyRoles('Admin'), createUser)
router.put('/users/:id', verifyToken, verifyRoles('Admin'), updateUser)
router.delete('/users/:id', verifyToken, verifyRoles('Admin'), deleteUser)
router.get('/users/:id', verifyToken, verifyRoles('Admin'), getUserById)

router.get('/quejas', verifyToken, verifyRoles('Admin'), getAllQuejas)
router.get('/quejas/:id', verifyToken, verifyRoles('Admin', 'Estudiante', 'Docente', 'Pasante'), getQuejasById)
router.put('/quejas/:id', verifyToken, verifyRoles('Admin'), updateQuejasStatus)
router.get('/quejas-tareas/:id', verifyToken, verifyRoles('Admin', 'Estudiante', 'Docente', 'Pasante'), getTareaOfQueja)

router.post('/tareas', verifyToken, verifyRoles('Admin'), createTarea)
router.get('/tareas', verifyToken, verifyRoles('Admin'), getAllTareas)
router.get('/tareas/:id', verifyToken, verifyRoles('Admin', 'Estudiante', 'Docente', 'Pasante'), getTareaById)
router.put('/tareas/:id', verifyToken, verifyRoles('Admin'), updateTareaStatus)

router.get('/pasantes', verifyToken, verifyRoles('Admin'), getAllPasante)

export default router
