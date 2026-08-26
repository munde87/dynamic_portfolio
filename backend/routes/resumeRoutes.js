const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('../middleware/authMiddleware');
const resumeController = require('../controllers/resumeController');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration for Resumes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, 'resume-' + uniqueSuffix + '-' + cleanName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.pdf' || file.mimetype === 'application/pdf') {
      return cb(null, true);
    }
    return cb(new Error('Invalid file format. Only PDF documents are allowed!'), false);
  }
});

// Routes
router.get('/', resumeController.getActiveResume);
router.post('/', verifyToken, upload.single('resume'), resumeController.uploadResume);
router.put('/', verifyToken, upload.single('resume'), resumeController.replaceResume);
router.delete('/', verifyToken, resumeController.deleteResume);

module.exports = router;
