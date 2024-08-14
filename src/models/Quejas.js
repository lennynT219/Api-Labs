import mongoose from 'mongoose'

const QuejasSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'Pendiente' },
  creador_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resuelta_por: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fecha_resuelta: { type: Date },
  img_queja: { type: String },
  img_queja_id: { type: String }
}, { timestamps: true })

export default mongoose.model('Quejas', QuejasSchema)
