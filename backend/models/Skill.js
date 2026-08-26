const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  number:      { type: String, default: '' },
  badge:       { type: String, default: '' },
  level:       { type: String, default: 'Advanced' },
  category:    { type: String, required: true, default: 'FRONTEND' },
  description: { type: String, default: '' },
  tags:        [{ type: String }],
  icon:        { type: String, default: '' },
  order:       { type: Number, default: 0 },
}, { timestamps: true })

module.exports = mongoose.model('Skill', skillSchema)