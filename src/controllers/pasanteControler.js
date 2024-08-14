import mongoose from 'mongoose'
import Quejas from '../models/Quejas.js'
import Tareas from '../models/Tareas.js'
import { v2 as cloudinary } from 'cloudinary'

const getallTareas = async (req, res) => {
  try {
    const tareas = await Tareas.find({ asignada_a: req.user._id })

    const tareasFormated = tareas.map(tarea => ({
      id: tarea._id,
      titulo: tarea.title,
      descripcion: tarea.description,
      fecha: tarea.createdAt.toISOString().split('T')[0],
      estado: tarea.status
    }))
    res.status(200).json(tareasFormated)
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] })
  }
}

const getTareaById = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ errors: [{ msg: 'El ID no es válido' }] })
    const tarea = await Tareas.findById({ _id: id, asignada_a: req.user._id }).populate('queja_id', 'description img_queja')
    res.status(200).json(tarea)
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] })
  }
}

const updateTareaStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    console.log(status)
    const tarea = await Tareas.findByIdAndUpdate({ _id: id, asignada_a: req.user._id }, { status })
    if (tarea.status === 'Completada') {
      await Quejas.findByIdAndUpdate(tarea.queja_id, { status: 'Resuelta', resuelta_por: req.user._id, fecha_resuelta: new Date() })
    }
    const cloudinaryRespose = await cloudinary.uploader.upload(req.files.img.tempFilePath, { folder: 'Sis_Labs/Tareas' })
    tarea.img_tarea = cloudinaryRespose.secure_url
    tarea.img_tarea_id = cloudinaryRespose.public_id
    await tarea.save()
    res.status(200).json({ errors: [{ msg: 'Tarea actualizada' }] })
  } catch (err) {
    res.status(500).json({ errors: [{ msg: err.message }] })
  }
}

export { getallTareas, getTareaById, updateTareaStatus }
