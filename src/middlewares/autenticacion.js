import jwt from 'jsonwebtoken'
import Docente from '../models/Docente.js'
import Estudiante from '../models/Estudiantes.js'

const verificarAutenticacion = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(404).json({ msg: 'Lo sentimos, debes proporcionar un token' })
  }

  const { authorization } = req.headers
  const token = authorization.split(' ')[1]

  // Imprimir el token recibido
  console.log('Token recibido:', token)

  try {
    const { id, rol } = jwt.verify(token, process.env.JWT_SECRET)
    if (rol === 'docente') {
      req.docenteBDD = await Docente.findById(id).lean()
      next()
    } else {
      req.estudianteBDD = await Estudiante.findById(id).lean()
      next()
    }
  } catch (error) {
    console.error('Error al verificar el token:', error.message)
    return res.status(401).json({ msg: 'Formato del token no válido' })
  }
}

export default verificarAutenticacion
