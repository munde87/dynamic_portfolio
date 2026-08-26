const Achievement    = require('../models/Achievement')
const { cloudinary } = require('../config/cloudinary')

const getAll = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ order: 1, createdAt: -1 })
    res.status(200).json({ success: true, data: achievements })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getOne = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
    if (!achievement)
      return res.status(404).json({ success: false, message: 'Achievement not found.' })
    res.status(200).json({ success: true, data: achievement })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const create = async (req, res) => {
  try {
    const { title, description, date, order } = req.body
    const imageUrl      = req.file?.path     || ''
    const imagePublicId = req.file?.filename || ''

    const achievement = await Achievement.create({
      title, description, date,
      imageUrl, imagePublicId,
      order: order !== undefined ? Number(order) : 0,
    })
    res.status(201).json({ success: true, data: achievement })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const update = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
    if (!achievement)
      return res.status(404).json({ success: false, message: 'Achievement not found.' })

    if (req.file && achievement.imagePublicId)
      await cloudinary.uploader.destroy(achievement.imagePublicId)

    const { title, description, date, order } = req.body

    if (title       !== undefined) achievement.title       = title
    if (description !== undefined) achievement.description = description
    if (date        !== undefined) achievement.date        = date
    if (order       !== undefined) achievement.order       = Number(order)
    if (req.file) {
      achievement.imageUrl      = req.file.path
      achievement.imagePublicId = req.file.filename
    }

    await achievement.save()
    res.status(200).json({ success: true, data: achievement })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const remove = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
    if (!achievement)
      return res.status(404).json({ success: false, message: 'Achievement not found.' })

    if (achievement.imagePublicId)
      await cloudinary.uploader.destroy(achievement.imagePublicId)

    await achievement.deleteOne()
    res.status(200).json({ success: true, message: 'Achievement deleted.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getAll, getOne, create, update, remove }