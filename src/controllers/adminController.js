import mongoose from 'mongoose'
import Quejas from '../models/Quejas.js'
import User from '../models/Users.js'
import Tareas from '../models/Tareas.js'
import { sendMailToUser } from '../config/nodemailer.js'

const createUser = async (req, res) => {
  try {
    const { email, username } = req.body

    if (Object.values(req.body).includes('')) return res.status(400).json({ message: 'Porfavor llene todos los datos' })
    const verificarEmail = await User.findOne({ email })
    if (verificarEmail) return res.status(400).json({ message: 'El email ya existe' })
    const verificarUsername = await User.findOne({ username })
    if (verificarUsername) return res.status(400).json({ message: 'El username ya existe' })

    const newUser = new User(req.body)
    const password = Math.random().toString(36).slice(2)
    newUser.password = await newUser.encryptPassword('lab' + password)
    const token = await newUser.createToken()
    sendMailToUser(email, token, 'lab' + password)
    await newUser.save()

    res.status(201).json({ message: 'Usuario creado', newUser })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getAllPasante = async (req, res) => {
  try {
    const users = await User.find({ rol: { $in: ['Pasante', 'Estudiante'] } })

    res.status(200).json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getUserById = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'El ID no es válido' })
    const user = await User.findById(id)
    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params

    if (Object.values(req.body).includes('')) return res.status(400).json({ message: 'Porfavor llene todos los datos' })
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'El ID no es válido' })
    if (req.body.password) {
      const password = req.body.password
      req.body.password = await User.encryptPassword(password)
    }
    const user = await User.findByIdAndUpdate(id, req.body, { new: true })

    res.status(201).json({ message: 'Usuario actualizado', user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'El ID no es válido' })
    await User.findByIdAndDelete(id)
    res.status(200).json({ message: 'Usuario eliminado' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getAllQuejas = async (req, res) => {
  try {
    const quejas = await Quejas.find()
    const quejasFormat = quejas.map(queja => ({
      id: queja._id,
      titulo: queja.title,
      descripcion: queja.description,
      fecha: queja.createdAt.toISOString().split('T')[0],
      estado: queja.status
    }))
    res.status(200).json(quejasFormat)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getQuejasById = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'El ID no es válido' })
    const quejas = await Quejas.findById(id)
    res.status(200).json(quejas)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateQuejasStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const quejas = await Quejas.findByIdAndUpdate(id, { status }, { new: true })
    res.status(200).json({ errors: [{ msg: 'Queja actualizada' }] })
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] })
  }
}

const createTarea = async (req, res) => {
  try {
    if (Object.values(req.body).includes('')) return res.status(400).json({ errors: [{ msg: 'Porfavor llene todos los campos' }] })
    const tarea = new Tareas(req.body)
    await tarea.save()
    await User.findByIdAndUpdate(tarea.asignada_a, { rol: 'Pasante' })
    res.status(200).json({ errors: [{ msg: 'Tarea creada' }] })
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] })
  }
}

const getAllTareas = async (req, res) => {
  try {
    const tareas = await Tareas.find()
    res.status(200).json(tareas)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getTareaOfQueja = async (req, res) => {
  try {
    const { id } = req.params
    const tareas = await Tareas.find({ queja_id: id })
    const tareaFormat = await Promise.all(tareas.map(async tarea => {
      const responsable = await User.findById(tarea.asignada_a)
      return {
        id: tarea._id,
        titulo: tarea.title,
        descripcion: tarea.description,
        fecha: tarea.createdAt.toISOString().split('T')[0],
        estado: tarea.status,
        responsable: `${responsable.nombres} ${responsable.apellidos}`,
        img: tarea.img_tarea
      }
    }))
    console.log(tareaFormat)
    res.status(200).json(tareaFormat)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getTareaById = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'El ID no es válido' })
    const tarea = await Tareas.findById(id)
    res.status(200).json(tarea)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateTareaStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const tarea = await Tareas.findByIdAndUpdate(id, { status }, { new: true })
    res.status(200).json({ message: 'Tarea actualizada', tarea })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export {
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
}
