const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const FILE_SIZE_LIMIT = 5 * 1024 * 1024 // 5MB

const projectStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'anime-portfolio/projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation:  [{ width: 800, crop: 'limit', quality: 'auto' }],
  },
})

const experienceStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'anime-portfolio/experience',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation:  [{ width: 400, crop: 'limit', quality: 'auto' }],
  },
})

const achievementStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          'anime-portfolio/achievements',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation:  [{ width: 800, crop: 'limit', quality: 'auto' }],
  },
})

const uploadProject     = multer({ storage: projectStorage,     limits: { fileSize: FILE_SIZE_LIMIT } })
const uploadExperience  = multer({ storage: experienceStorage,  limits: { fileSize: FILE_SIZE_LIMIT } })
const uploadAchievement = multer({ storage: achievementStorage, limits: { fileSize: FILE_SIZE_LIMIT } })

module.exports = { cloudinary, uploadProject, uploadExperience, uploadAchievement }