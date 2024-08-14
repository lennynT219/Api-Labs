import { sendMailToUser } from '../config/nodemailer.js'
import { createToken } from '../middlewares/auth.js'
import Quejas from '../models/Quejas.js'
import User from '../models/Users.js'
import { v2 as cloudinary } from 'cloudinary'
// import fs from 'fs-extra'

const register = async (req, res) => {
  try {
    const { cedula, email, username, password } = req.body

    if (Object.values(req.body).includes('')) return res.status(400).json({ errors: [{ msg: 'Porfavor llene todos los campos' }] })
    const verificarCedula = await User.findOne({ cedula })
    if (verificarCedula) return res.status(400).json({ errors: [{ msg: 'La cedula ya esta registrada' }] })
    const verificarEmail = await User.findOne({ email })
    if (verificarEmail) return res.status(400).json({ errors: [{ msg: 'El correo ya esta registrado' }] })
    const verificarUsername = await User.findOne({ username })
    if (verificarUsername) return res.status(400).json({ errors: [{ msg: 'El nombre de usuario ya esta registrado' }] })

    const newUser = new User(req.body)
    newUser.password = await newUser.encryptPassword(password)
    const token = await newUser.createToken()
    sendMailToUser(email, token)
    await newUser.save()
    res.status(201).json({ msg: 'Usuario creado, revisa tu correo para confirmar tu cuenta' })
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] })
  }
}

const updateUser = async (req, res) => {
  try {
    const { nombres, apellidos, email, genero, facultad, username } = req.body
    if (Object.values(req.body).includes('')) return res.status(400).json({ errors: [{ msg: 'Porfavor llene todos los campos' }] })
    const user = await User.findById(req.user._id)
    await User.findByIdAndUpdate(req.user._id, req.body)
    const cloudinaryRespose = await cloudinary.uploader.upload(req.files.img.tempFilePath, { folder: 'Sis_Labs/Users' })
    user.img_pefil = cloudinaryRespose.secure_url
    user.img_pefil_id = cloudinaryRespose.public_id
    await user.save()
    res.status(200).json({ msg: 'Usuario actualizado' })
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] })
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (Object.values(req.body).includes('')) return res.status(400).json({ errors: [{ msg: 'Porfavor llene todos los campos' }] })
    const user = await User.findOne({ username })
    if (!user) return res.status(400).json({ errors: [{ msg: 'Usuario no registrado' }] })
    const match = await user.matchPassword(password)
    if (!match) return res.status(400).json({ errors: [{ msg: 'Contraseña incorrecta' }] })
    const token = createToken(user._id)
    res.status(200).json({ msg: 'Bienvenido', token })
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] })
  }
}

const pefil = async (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] })
  }
}

const createQueja = async (req, res) => {
  try {
    const { title, description } = req.body
    if (Object.values(req.body).includes('')) return res.status(400).json({ errors: [{ msg: 'Porfavor llene todos los campos' }] })
    const newQueja = new Quejas({ title, description, creador_id: req.user._id })
    const cloudinaryRespose = await cloudinary.uploader.upload(req.files.img.tempFilePath, { folder: 'Sis_Labs/Quejas' })
    newQueja.img_queja = cloudinaryRespose.secure_url
    newQueja.img_queja_id = cloudinaryRespose.public_id
    await newQueja.save()
    res.status(201).json({ msg: 'Queja creada' })
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] })
  }
}

const getAllQuejas = async (req, res) => {
  try {
    const quejas = await Quejas.find({ creador_id: req.user._id })
    const quejasFormat = quejas.map(queja => ({
      id: queja._id,
      titulo: queja.title,
      descripcion: queja.description,
      fecha: queja.createdAt.toISOString().split('T')[0],
      estado: queja.status
    }))
    res.status(200).json(quejasFormat)
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] })
  }
}

const confirmarEmail = async (req, res) => {
  try {
    if (!(req.params.token)) return res.status(400).json({ errors: [{ msg: 'Lo sentimos, no se puede validar la cuenta' }] })
    const user = await User.findOne({ token: req.params.token })
    if (!user?.token) return res.status(400).json({ errors: [{ msg: 'La cuenta ya a sido confirmada' }] })
    user.token = null
    user.confirmEmail = true
    await user.save()
    res.status(200).json({ msg: 'Cuenta confirmada, ya puede iniciar sesión' })
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] })
  }
}

export { register, login, createQueja, getAllQuejas, confirmarEmail, pefil, updateUser }
