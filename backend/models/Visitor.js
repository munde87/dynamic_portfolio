const mongoose = require('mongoose')

const visitorSchema = new mongoose.Schema({
  email:     { type: String, required: true, trim: true, lowercase: true, unique: true },
  name:      { type: String, default: 'Visitor' },
  thankSent: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Visitor', visitorSchema)