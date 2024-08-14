import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
  cedula: { type: String, required: true, unique: true },
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  genero: { type: String, enum: ['M', 'F', 'O'] },
  facultad: { type: String, required: true },
  rol: { type: String, enum: ['Admin', 'Docente', 'Estudiante', 'Pasante'] }, // Define roles posibles
  username: { type: String, required: true, unique: true },
  token: { type: String, default: null },
  confirmEmail: { type: Boolean, default: false },
  img_pefil: { type: String, default: null },
  img_pefil_id: { type: String, default: null }
}, { timestamps: true })

// Encriptar contraseña
UserSchema.methods.encryptPassword = async password => {
  const salt = await bcrypt.genSalt(10)
  const passwordEncrypt = await bcrypt.hash(password, salt)
  return passwordEncrypt
}

// Comparar contraseñas
UserSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

// Token OTP
UserSchema.methods.createToken = async function () {
  const newToken = this.token = Math.random().toString(36).slice(2)
  return newToken
}

export default mongoose.model('User', UserSchema)
