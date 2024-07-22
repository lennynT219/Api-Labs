import mongoose from 'mongoose'

const QuejasSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'pending' },
  creador_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resuelta_por: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fecha_resuelta: { type: Date },
  img: { type: String },
  public_id: { type: String }
}, { timestamps: true })

export default mongoose.model('Quejas', QuejasSchema)
