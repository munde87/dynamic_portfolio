const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  passwordChangedAt: { type: Date, default: Date.now },
}, { timestamps: true })

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordChangedAt = new Date()
  next()
})

adminSchema.methods.comparePassword = async function (plain) {
  return await bcrypt.compare(plain, this.password)
}

module.exports = mongoose.model('Admin', adminSchema)