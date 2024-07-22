// Requerir los módulos
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cloudinary from 'cloudinary'
import fileUPload from 'express-fileupload'
import adminRoutes from './routers/adminRoutes.js'
import userRoutes from './routers/userRoutes.js'
import pasanteRoutes from './routers/pasanteRoutes.js'

// Inicializaciones
const app = express()
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use(fileUPload({
  useTempFiles: true,
  tempFileDir: './uploads'
}))

// Configuraciones
app.set('port', process.env.port || 3000)
app.use(cors())

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
