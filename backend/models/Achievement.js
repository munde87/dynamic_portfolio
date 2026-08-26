const mongoose = require('mongoose')

const achievementSchema = new mongoose.Schema({
  title:         { type: String, required: true, trim: true },
  description:   { type: String, required: true },
  date:          { type: String, required: true }, // e.g. "Feb 24, 2025"
  imageUrl:      { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  order:         { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Achievement', achievementSchema)