const Experience        = require('../models/Experience')
const { cloudinary }    = require('../config/cloudinary')
const { safeParseArray } = require('../utils/helpers')

const getAll = async (req, res) => {
  try {
    const page  = parseInt(req.query.page)  || 1
    const limit = parseInt(req.query.limit) || 50
    const skip  = (page - 1) * limit

    const [experiences, total] = await Promise.all([
      Experience.find().sort({ order: 1 }).skip(skip).limit(limit),
      Experience.countDocuments()
    ])

    res.status(200).json({ success: true, data: experiences, total, page, limit })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getOne = async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id)
    if (!exp)
      return res.status(404).json({ success: false, message: 'Experience not found.' })
    res.status(200).json({ success: true, data: exp })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const create = async (req, res) => {
  try {
    const { role, company, description, startDate, endDate, technologies, order } = req.body
    const imageUrl      = req.file?.path     || ''
    const imagePublicId = req.file?.filename || ''

    const exp = await Experience.create({
      role, company,
      description:  description || '',
      startDate,
      endDate:      endDate || 'Present',
      technologies: safeParseArray(technologies),
      imageUrl, imagePublicId,
      order: order !== undefined ? Number(order) : 0,
    })
    res.status(201).json({ success: true, data: exp })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const update = async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id)
    if (!exp)
      return res.status(404).json({ success: false, message: 'Experience not found.' })

    if (req.file && exp.imagePublicId)
      await cloudinary.uploader.destroy(exp.imagePublicId)

    const { role, company, description, startDate, endDate, technologies, order } = req.body

    if (role         !== undefined) exp.role         = role
    if (company      !== undefined) exp.company      = company
    if (description  !== undefined) exp.description  = description
    if (startDate    !== undefined) exp.startDate    = startDate
    if (endDate      !== undefined) exp.endDate      = endDate
    if (technologies !== undefined) exp.technologies = safeParseArray(technologies)
    if (order        !== undefined) exp.order        = Number(order)
    if (req.file) {
      exp.imageUrl      = req.file.path
      exp.imagePublicId = req.file.filename
    }

    await exp.save()
    res.status(200).json({ success: true, data: exp })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const remove = async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id)
    if (!exp)
      return res.status(404).json({ success: false, message: 'Experience not found.' })

    if (exp.imagePublicId)
      await cloudinary.uploader.destroy(exp.imagePublicId)

    await exp.deleteOne()
    res.status(200).json({ success: true, message: 'Experience deleted.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getAll, getOne, create, update, remove }