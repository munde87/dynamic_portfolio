const express        = require('express')
const router         = express.Router()
const { getAll, getOne, create, update, remove } = require('../controllers/experienceController')
const { verifyToken }      = require('../middleware/authMiddleware')
const { uploadExperience } = require('../config/cloudinary')

router.get('/',       getAll)
router.get('/:id',    getOne)
router.post('/',      verifyToken, uploadExperience.single('image'), create)
router.put('/:id',    verifyToken, uploadExperience.single('image'), update)
router.delete('/:id', verifyToken, remove)

module.exports = router