const express        = require('express')
const router         = express.Router()
const { getAll, getOne, create, update, remove } = require('../controllers/achievementController')
const { verifyToken }       = require('../middleware/authMiddleware')
const { uploadAchievement } = require('../config/cloudinary')

router.get('/',       getAll)
router.get('/:id',    getOne)
router.post('/',      verifyToken, uploadAchievement.single('image'), create)
router.put('/:id',    verifyToken, uploadAchievement.single('image'), update)
router.delete('/:id', verifyToken, remove)

module.exports = router