// Requerir los módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import cloudinary from 'cloudinary'
import fileUPload from 'express-fileupload'

// Importar las Rutas
import adminRoutes from './routers/adminRoutes.js'
import userRoutes from './routers/userRoutes.js'
import pasanteRoutes from './routers/pasanteRoutes.js'

// Inicializaciones
const app = express()
dotenv.config()
app.use(cors())
app.use(morgan('dev'))

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Configuración de express-fileupload
app.use(fileUPload({
  useTempFiles: true,
  tempFileDir: './uploads'
}))

// Configuraciones
app.set('port', process.env.port || 3000)

// Ruta Raiz
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to my API' })
})

// Middlewares
app.use(express.json())

// Rutas
app.use('/admin', adminRoutes)
app.use('/user', userRoutes)
app.use('/pasante', pasanteRoutes)

// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send('Endpoint no encontrado - 404'))

// Exportar la instancia de express por medio de app
export default app
