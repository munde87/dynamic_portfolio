const mongoose = require('mongoose')

const experienceSchema = new mongoose.Schema({
  role:          { type: String, required: true, trim: true },
  company:       { type: String, required: true, trim: true },
  description:   { type: String, default: '' },
  startDate:     { type: String, required: true },
  endDate:       { type: String, default: 'Present' },
  imageUrl:      { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  technologies:  [{ type: String }],
  order:         { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Experience', experienceSchema)