import mongoose from 'mongoose'
import Quejas from '../models/Quejas.js'
import Tareas from '../models/Tareas.js'

const getallTareas = async (req, res) => {
  try {
    const tareas = await Tareas.find({ asignada_a: req.user._id })
    res.status(200).json(tareas)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const getTareaById = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'El ID no es válido' })
    const tarea = await Tareas.findById({ _id: id, asignada_a: req.user._id })
    res.status(200).json(tarea)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

const updateTareaStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const tarea = await Tareas.findByIdAndUpdate({ _id: id, asignada_a: req.user._id }, { status }, { new: true })
    if (tarea.status === 'Completada') {
      await Quejas.findByIdAndUpdate(tarea.queja_id, { status: 'Resuelta', resuelta_por: req.user._id, fecha_resuelta: new Date() })
    }
    res.status(200).json({ message: 'Tarea actualizada', tarea })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export { getallTareas, getTareaById, updateTareaStatus }
