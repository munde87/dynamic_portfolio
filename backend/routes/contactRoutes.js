const express   = require('express')
const router    = express.Router()
const { sendContact, thankVisitor } = require('../controllers/contactController')

router.post('/contact', sendContact)
router.post('/visitor', thankVisitor)

module.exports = router