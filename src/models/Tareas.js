import mongoose from 'mongoose'

const TareasSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Pendiente' },
  queja_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Quejas' },
  asignada_a: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  img_tarea: { type: String },
  img_tarea_id: { type: String },
  fecha_resuelta: { type: Date }
}, { timestamps: true })

export default mongoose.model('Tareas', TareasSchema)
