const express   = require('express')
const router    = express.Router()
const rateLimit = require('express-rate-limit')
const {
  login,
  logout,
  verifyMe,
  getAccount,
  updateUsername,
  updatePassword
} = require('../controllers/adminController')
const { verifyToken } = require('../middleware/authMiddleware')

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts. Try again after 15 minutes.' }
})

// Authentication Routes
router.post('/login',  loginLimiter, login)
router.post('/logout', logout)
router.get('/me',      verifyToken, verifyMe)

// Account & Security Settings Routes
router.get('/account',            verifyToken, getAccount)
router.patch('/account/username', verifyToken, updateUsername)
router.patch('/account/password', verifyToken, updatePassword)

module.exports = router