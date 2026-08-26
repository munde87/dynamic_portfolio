const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { verifyToken } = require('../middleware/authMiddleware');

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|svg|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (jpg, png, webp, svg) are allowed!'));
    }
  }
});

const uploadModel = multer({
  storage,
  limits: { fileSize: 60 * 1024 * 1024 }, // 60MB limit for 3D GLB models
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.glb' || ext === '.gltf') {
      return cb(null, true);
    } else {
      cb(new Error('Only 3D GLB/GLTF models (.glb, .gltf) are allowed!'));
    }
  }
});

router.post('/', verifyToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file uploaded.' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    imageUrl,
    message: 'Image uploaded successfully!'
  });
});

router.post('/model', verifyToken, uploadModel.single('model'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No 3D model file uploaded.' });
  }
  const modelUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    modelUrl,
    message: '3D GLB Model uploaded successfully!'
  });
});

module.exports = router;
