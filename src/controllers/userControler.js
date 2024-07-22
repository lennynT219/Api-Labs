import { sendMailToUser } from '../config/nodemailer.js'
import { createToken } from '../middlewares/auth.js'
import Quejas from '../models/Quejas.js'
import User from '../models/Users.js'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs-extra'

const register = async (req, res) => {
  try {
    const { email, username, password } = req.body

    if (Object.values(req.body).includes('')) return res.status(400).json({ message: 'Porfavor llene todos los datos' })
    const verificarEmail = await User.findOne({ email })
    if (verificarEmail) return res.status(400).json({ message: 'El email ya existe' })
    const verificarUsername = await User.findOne({ username })
    if (verificarUsername) return res.status(400).json({ message: 'El username ya existe' })

    const newUser = new User(req.body)
    newUser.password = await newUser.encryptPassword(password)
    const token = await newUser.createToken()
    sendMailToUser(email, token)
    await newUser.save()
    await fs.unlink(req.files.img.tempFilePath)
    res.status(201).json({ message: 'Usuario creado', newUser })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body
    if (Object.values(req.body).includes('')) return res.status(400).json({ message: 'Porfavor llene todos los datos' })
    const user = await User.findOne({ username })
    if (!user) return res.status(400).json({ message: 'El email no existe' })
    const match = await user.matchPassword(password)
    if (!match) return res.status(400).json({ message: 'Contraseña incorrecta' })
    const token = createToken(user._id, user.rol)
    res.status(200).json({ message: 'Bienvenido', user, token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const createQueja = async (req, res) => {
  try {
    const { title, description } = req.body
    if (Object.values(req.body).includes('')) return res.status(400).json({ message: 'Porfavor llene todos los datos' })
    const newQueja = new Quejas({ title, description, creador_id: req.user._id })
    const cloudinaryRespose = await cloudinary.uploader.upload(req.files.img.tempFilePath, { folder: 'Quejas' })
    newQueja.img = cloudinaryRespose.secure_url
    newQueja.public_id = cloudinaryRespose.public_id
    await newQueja.save()
    res.status(201).json({ message: 'Queja creada', newQueja })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getAllQuejas = async (req, res) => {
  try {
    const quejas = await Quejas.find({ creador_id: req.user._id })
    res.status(200).json(quejas)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const confirmarEmail = async (req, res) => {
  try {
    if (!(req.params.token)) return res.status(400).json({ msg: 'Lo sentimos, no se puede validar la cuenta' })
    const user = await User.findOne({ token: req.params.token })
    if (!user?.token) return res.status(400).json({ msg: 'La cuenta ya a sido confirmada' })
    user.token = null
    user.confirmEmail = true
    await user.save()
    res.status(200).json({ msg: 'Cuenta confirmada' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export { register, login, createQueja, getAllQuejas, confirmarEmail }
