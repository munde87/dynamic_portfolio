const express = require('express')
const router  = express.Router()
const { getAll, create, update, remove } = require('../controllers/skillController')
const { verifyToken } = require('../middleware/authMiddleware')

router.get('/',       getAll)
router.post('/',      verifyToken, create)
router.put('/:id',    verifyToken, update)
router.delete('/:id', verifyToken, remove)

module.exports = router