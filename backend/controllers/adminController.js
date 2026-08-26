const jwt   = require('jsonwebtoken')
const Admin = require('../models/Admin')

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password)
      return res.status(400).json({ success: false, message: 'Username and password required.' })

    const admin = await Admin.findOne({ username: username.trim() })
    if (!admin)
      return res.status(401).json({ success: false, message: 'Invalid credentials.' })

    const match = await admin.comparePassword(password)
    if (!match)
      return res.status(401).json({ success: false, message: 'Invalid credentials.' })

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.cookie('token', token, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({ success: true, message: 'Login successful.', token, username: admin.username })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

const logout = (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS)
  res.status(200).json({ success: true, message: 'Logged out.' })
}

const verifyMe = (req, res) => {
  res.status(200).json({ success: true, admin: req.admin })
}

// @desc    Get admin account details
// @route   GET /api/admin/account
// @access  Private
const getAccount = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password')
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found.' })
    }
    res.status(200).json({
      success: true,
      admin: {
        id: admin._id,
        username: admin.username,
        passwordChangedAt: admin.passwordChangedAt || admin.updatedAt,
        updatedAt: admin.updatedAt,
        createdAt: admin.createdAt,
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @desc    Update admin username
// @route   PATCH /api/admin/account/username
// @access  Private
const updateUsername = async (req, res) => {
  try {
    const { newUsername } = req.body
    if (!newUsername || newUsername.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Username must be at least 3 characters long.' })
    }

    const cleanUsername = newUsername.trim()

    // Check if another admin already uses this username
    const existing = await Admin.findOne({ username: cleanUsername, _id: { $ne: req.admin.id } })
    if (existing) {
      return res.status(400).json({ success: false, message: 'Username already in use. Please select another.' })
    }

    const admin = await Admin.findById(req.admin.id)
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found.' })
    }

    admin.username = cleanUsername
    await admin.save()

    // Refresh JWT with new username
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.cookie('token', token, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      success: true,
      message: 'Username updated successfully!',
      username: admin.username,
      token,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

// @desc    Update admin password
// @route   PATCH /api/admin/account/password
// @access  Private
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required.' })
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' })
    }

    const admin = await Admin.findById(req.admin.id)
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin account not found.' })
    }

    // Verify current password server-side
    const isMatch = await admin.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password verification failed. Incorrect password.' })
    }

    admin.password = newPassword // Pre-save hook will hash it with bcrypt
    await admin.save()

    // Re-issue fresh token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    res.cookie('token', token, {
      ...COOKIE_OPTIONS,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(200).json({
      success: true,
      message: 'Password updated and secured successfully!',
      token,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
}

module.exports = {
  login,
  logout,
  verifyMe,
  getAccount,
  updateUsername,
  updatePassword
}