const Project          = require('../models/Project')
const { cloudinary }   = require('../config/cloudinary')
const { safeParseArray } = require('../utils/helpers')

const defaultProjects = [
  {
    title: "BookBuddy",
    description: "An online platform designed for book lovers to rent, exchange, and sell books easily. Connects users who want to give old books a new life with readers looking for affordable books.",
    tags: ["React", "Node.js", "Express.js", "MongoDB", "Tailwind CSS"],
    liveUrl: "https://bookbuddy-app.vercel.app",
    githubUrl: "https://github.com/munde87/BookBuddy",
    imageUrl: "/assets/project-bookbuddy.jpg",
    featured: true,
    order: 1
  },
  {
    title: "Tumhara Arogya",
    description: "Comprehensive Panchakarma Management System featuring patient details analysis (Vata, Pitta, Kapha), multi-day treatment scheduling, progress tracking, therapist allocation, and management insights.",
    tags: ["React", "Node.js", "Express.js", "MongoDB", "Cloud Sync", "Healthcare"],
    liveUrl: "https://arogya-health.vercel.app",
    githubUrl: "https://github.com/munde87/Arogya",
    imageUrl: "/assets/project-arogya.png",
    featured: true,
    order: 2
  }
]

const getAll = async (req, res) => {
  try {
    let projects = await Project.find().sort({ order: 1 })
    const oldTitles = ['EcoVidya', 'MessInfoHub']
    const hasOld = projects.some(p => oldTitles.includes(p.title))
    if (projects.length === 0 || hasOld) {
      await Project.deleteMany({})
      projects = await Project.insertMany(defaultProjects)
    }
    res.status(200).json({ success: true, data: projects, total: projects.length })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const getOne = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project)
      return res.status(404).json({ success: false, message: 'Project not found.' })
    res.status(200).json({ success: true, data: project })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const create = async (req, res) => {
  try {
    const { title, description, tags, liveUrl, githubUrl, featured, order } = req.body
    const imageUrl      = req.file?.path     || ''
    const imagePublicId = req.file?.filename || ''

    const project = await Project.create({
      title, description,
      tags:      safeParseArray(tags),
      imageUrl, imagePublicId,
      liveUrl:   liveUrl   || '',
      githubUrl: githubUrl || '',
      featured:  featured === 'true' || featured === true,
      order:     order !== undefined ? Number(order) : 0,
    })
    res.status(201).json({ success: true, data: project })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const update = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project)
      return res.status(404).json({ success: false, message: 'Project not found.' })

    if (req.file && project.imagePublicId)
      await cloudinary.uploader.destroy(project.imagePublicId)

    const { title, description, tags, liveUrl, githubUrl, featured, order } = req.body

    if (title       !== undefined) project.title       = title
    if (description !== undefined) project.description = description
    if (tags        !== undefined) project.tags        = safeParseArray(tags)
    if (liveUrl     !== undefined) project.liveUrl     = liveUrl
    if (githubUrl   !== undefined) project.githubUrl   = githubUrl
    if (featured    !== undefined) project.featured    = featured === 'true' || featured === true
    if (order       !== undefined) project.order       = Number(order)
    if (req.file) {
      project.imageUrl      = req.file.path
      project.imagePublicId = req.file.filename
    }

    await project.save()
    res.status(200).json({ success: true, data: project })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const remove = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project)
      return res.status(404).json({ success: false, message: 'Project not found.' })

    if (project.imagePublicId)
      await cloudinary.uploader.destroy(project.imagePublicId)

    await project.deleteOne()
    res.status(200).json({ success: true, message: 'Project deleted.' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = { getAll, getOne, create, update, remove }