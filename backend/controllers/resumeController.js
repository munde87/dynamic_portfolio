const Resume = require('../models/Resume');
const fs = require('fs');
const path = require('path');

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// @desc    Get current active resume (Public)
// @route   GET /api/resume
// @access  Public
exports.getActiveResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ isActive: true }).sort({ updatedAt: -1 });
    res.json({
      success: true,
      data: resume || null,
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ success: false, message: 'Server error fetching resume.' });
  }
};

// @desc    Upload new active resume (Admin)
// @route   POST /api/resume
// @access  Private
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF file.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileSize = req.file.size;
    const formattedSize = formatBytes(fileSize);
    const fileName = req.file.originalname || req.file.filename;

    // Remove any previous active resume files on disk to save space
    const previousResumes = await Resume.find({ isActive: true });
    for (const old of previousResumes) {
      if (old.fileUrl) {
        const oldPath = path.join(__dirname, '..', old.fileUrl);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) {}
        }
      }
    }
    await Resume.deleteMany({}); // Keep clean single active record

    const newResume = await Resume.create({
      fileName,
      fileUrl,
      fileType: req.file.mimetype || 'application/pdf',
      fileSize,
      formattedSize,
      isActive: true,
      uploadedAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully!',
      data: newResume,
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ success: false, message: 'Server error uploading resume.' });
  }
};

// @desc    Replace current active resume (Admin)
// @route   PUT /api/resume
// @access  Private
exports.replaceResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a new PDF file to replace.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileSize = req.file.size;
    const formattedSize = formatBytes(fileSize);
    const fileName = req.file.originalname || req.file.filename;

    // Delete old files from disk
    const existing = await Resume.find({});
    for (const old of existing) {
      if (old.fileUrl) {
        const oldPath = path.join(__dirname, '..', old.fileUrl);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) {}
        }
      }
    }
    await Resume.deleteMany({});

    const updatedResume = await Resume.create({
      fileName,
      fileUrl,
      fileType: req.file.mimetype || 'application/pdf',
      fileSize,
      formattedSize,
      isActive: true,
      uploadedAt: new Date(),
      updatedAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Resume replaced successfully!',
      data: updatedResume,
    });
  } catch (error) {
    console.error('Error replacing resume:', error);
    res.status(500).json({ success: false, message: 'Server error replacing resume.' });
  }
};

// @desc    Delete current active resume (Admin)
// @route   DELETE /api/resume
// @access  Private
exports.deleteResume = async (req, res) => {
  try {
    const resumes = await Resume.find({});
    for (const r of resumes) {
      if (r.fileUrl) {
        const filePath = path.join(__dirname, '..', r.fileUrl);
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (e) {}
        }
      }
    }

    await Resume.deleteMany({});

    res.json({
      success: true,
      message: 'Resume deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ success: false, message: 'Server error deleting resume.' });
  }
};
