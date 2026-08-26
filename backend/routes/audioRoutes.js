const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('../middleware/authMiddleware');
const audioController = require('../controllers/audioController');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration for Audio
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, 'audio-' + uniqueSuffix + '-' + cleanName);
  }
});

const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/wave',
  'audio/x-wav',
  'audio/ogg',
  'audio/vorbis',
];

const ALLOWED_EXTENSIONS = ['.mp3', '.wav', '.ogg'];

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext) || ALLOWED_AUDIO_TYPES.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error('Invalid file format. Only MP3, WAV, and OGG audio files are allowed!'), false);
  }
});

// Public Routes
router.get('/', audioController.getActiveAudio);

// Protected Admin Routes
router.get('/settings', verifyToken, audioController.getAudioSettings);
router.post('/', verifyToken, upload.single('audio'), audioController.uploadAudio);
router.put('/', verifyToken, upload.single('audio'), audioController.replaceAudio);
router.patch('/settings', verifyToken, audioController.updateAudioSettings);
router.delete('/', verifyToken, audioController.deleteAudio);

module.exports = router;
