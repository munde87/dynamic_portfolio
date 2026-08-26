const express        = require('express')
const router         = express.Router()
const { getAll, getOne, create, update, remove } = require('../controllers/projectController')
const { verifyToken }   = require('../middleware/authMiddleware')
const { uploadProject } = require('../config/cloudinary')

router.get('/',       getAll)
router.get('/:id',    getOne)
router.post('/',      verifyToken, uploadProject.single('image'), create)
router.put('/:id',    verifyToken, uploadProject.single('image'), update)
router.delete('/:id', verifyToken, remove)

module.exports = router