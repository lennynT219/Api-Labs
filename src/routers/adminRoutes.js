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
  updateTareaStatus
} from '../controllers/adminController.js'
import { verifyRoles, verifyToken } from '../middlewares/auth.js'

const router = express.Router()

router.get('/users', verifyToken, verifyRoles('admin'), getAllUsers)
router.post('/users', verifyToken, verifyRoles('admin'), createUser)
router.put('/users/:id', verifyToken, verifyRoles('admin'), updateUser)
router.delete('/users/:id', verifyToken, verifyRoles('admin'), deleteUser)
router.get('/users/:id', verifyToken, verifyRoles('admin'), getUserById)

router.get('/quejas', verifyToken, verifyRoles('admin'), getAllQuejas)
router.get('/quejas/:id', verifyToken, verifyRoles('admin'), getQuejasById)
router.put('/quejas/:id', verifyToken, verifyRoles('admin'), updateQuejasStatus)

router.post('/tareas', verifyToken, verifyRoles('admin'), createTarea)
router.get('/tareas', verifyToken, verifyRoles('admin'), getAllTareas)
router.get('/tareas/:id', verifyToken, verifyRoles('admin'), getTareaById)
router.put('/tareas/:id', verifyToken, verifyRoles('admin'), updateTareaStatus)

export default router
