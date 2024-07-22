import jwt from 'jsonwebtoken'
import Users from '../models/Users.js'

const createToken = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado.' })
  }

  const { authorization } = req.headers

  try {
    const { id } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET)
    req.user = await Users.findById(id).lean().select('-password')
    next()
  } catch (err) {
    const e = new Error('Token no válido')
    return res.status(401).json({ message: e.message })
  }
}

// Middleware para verificar roles
const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const { user } = req
    console.log(user)
    if (user && allowedRoles.includes(user.rol)) {
      next()
    } else {
      res.status(403).json({ message: 'Acceso denegado: no tienes permiso para acceder a este recurso.' })
    }
  }
}

export {
  createToken,
  verifyToken,
  verifyRoles
}
