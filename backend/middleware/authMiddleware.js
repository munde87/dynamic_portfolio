const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  let token = req.cookies?.token

  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = decoded
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' })
  }
}

module.exports = { verifyToken }