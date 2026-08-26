require('dotenv').config()
const Admin     = require('./models/Admin')
const connectDB = require('./config/db')

const seed = async () => {
  await connectDB()

  const existing = await Admin.findOne({ username: process.env.ADMIN_USERNAME })
  if (existing) {
    console.log('Admin already exists.')
    process.exit(0)
  }

  await Admin.create({
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  })

  console.log('Admin created! Username:', process.env.ADMIN_USERNAME)
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })