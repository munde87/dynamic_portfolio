const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
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
    default: 'application/pdf',
  },
  fileSize: {
    type: Number, // in bytes
    required: true,
  },
  formattedSize: {
    type: String, // e.g. "1.45 MB"
  },
  isActive: {
    type: Boolean,
    default: true,
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

module.exports = mongoose.model('Resume', resumeSchema);
