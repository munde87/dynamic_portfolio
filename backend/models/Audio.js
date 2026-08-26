const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    default: 'audio/mpeg',
  },
  fileSize: {
    type: Number,
    required: true,
  },
  formattedSize: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isEnabled: {
    type: Boolean,
    default: true,
  },
  defaultVolume: {
    type: Number,
    default: 20,
    min: 0,
    max: 100,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Audio', audioSchema);
