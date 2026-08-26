const express   = require('express')
const router    = express.Router()
const rateLimit = require('express-rate-limit')
const { sendContact, thankVisitor } = require('../controllers/contactController')

// Contact form — rate limited to prevent email spam abuse
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many messages. Try again after 15 minutes.' }
})

// Visitor thank you — limited (spam rokne ke liye)
const visitorLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Too many requests. Try again later.' }
})

router.post('/contact', contactLimiter, sendContact)
router.post('/visitor', visitorLimiter, thankVisitor)

module.exports = router