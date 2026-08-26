require('dotenv').config()
const express      = require('express')
const cors         = require('cors')
const helmet       = require('helmet')
const cookieParser = require('cookie-parser')
const morgan       = require('morgan')
const compression  = require('compression')
const mongoose     = require('mongoose')
const multer       = require('multer')
const connectDB    = require('./config/db')
const fs           = require('fs')
const path         = require('path')

const adminRoutes       = require('./routes/adminRoutes')
const heroRoutes        = require('./routes/heroRoutes')
const aboutRoutes       = require('./routes/aboutRoutes')
const projectRoutes     = require('./routes/projectRoutes')
const skillRoutes       = require('./routes/skillRoutes')
const experienceRoutes  = require('./routes/experienceRoutes')
const codeRoutes        = require('./routes/codeRoutes')
const uploadRoutes      = require('./routes/uploadRoutes')
const contactRoutes     = require('./routes/contactRoutes')
const achievementRoutes = require('./routes/achievementRoutes')
const resumeRoutes      = require('./routes/resumeRoutes')
const audioRoutes       = require('./routes/audioRoutes')

/* ── Validate critical env vars ────────────────────────────── */
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET']
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`⚠️ Missing required environment variable: ${key}`)
    if (process.env.NODE_ENV === 'production') {
      process.exit(1)
    }
  }
}

const app = express()

// Trust proxy for deployment on platforms like Render, Vercel, Railway, Heroku
app.set('trust proxy', 1)

/* ── Security & parsing middleware ─────────────────────────── */
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(compression())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map(url => url.trim())
  .filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    // Allow local development ports automatically
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

/* ── Ensure Uploads Directory Exists ───────────────────────── */
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}
app.use('/uploads', express.static(uploadDir, { maxAge: '7d' }))

/* ── Database ──────────────────────────────────────────────── */
connectDB()

/* ── API Routes ────────────────────────────────────────────── */
app.use('/api/admin',        adminRoutes)
app.use('/api/hero',         heroRoutes)
app.use('/api/about',        aboutRoutes)
app.use('/api/projects',     projectRoutes)
app.use('/api/skills',       skillRoutes)
app.use('/api/experience',   experienceRoutes)
app.use('/api/code-examples',codeRoutes)
app.use('/api/upload',       uploadRoutes)
app.use('/api',              contactRoutes)
app.use('/api/achievements', achievementRoutes)
app.use('/api/resume',       resumeRoutes)
app.use('/api/audio',        audioRoutes)

/* ── Health check ──────────────────────────────────────────── */
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  res.json({
    status: dbState === 'connected' ? 'ok' : 'degraded',
    db: dbState,
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  })
})

/* ── Optional Production Frontend Static Serving ───────────── */
const frontendDist = path.join(__dirname, '../frontend/dist')
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next()
    }
    res.sendFile(path.join(frontendDist, 'index.html'))
  })
}

/* ── 404 handler ───────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route not found.' })
})

/* ── Global error handler ──────────────────────────────────── */
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: `Upload error: ${err.message}` })
  }
  console.error('[SERVER ERROR]:', err.message || err)
  res.status(500).json({ success: false, message: 'Internal server error.' })
})

/* ── Start server with graceful shutdown ───────────────────── */
const PORT = process.env.PORT || 5000
const server = app.listen(PORT, () => console.log(`🚀 Production Server running on http://localhost:${PORT}`))

const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`)
  server.close(() => {
    mongoose.connection.close(false).then(() => {
      console.log('MongoDB connection closed.')
      process.exit(0)
    })
  })
  setTimeout(() => { process.exit(1) }, 10000)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT',  () => gracefulShutdown('SIGINT'))