const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (err) {
    console.error(`MongoDB Error: ${err.message}`)
    process.exit(1)
  }

  // Runtime connection event listeners
  mongoose.connection.on('error', (err) => console.error('MongoDB runtime error:', err))
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected. Attempting reconnect...'))
  mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected.'))
}

module.exports = connectDB