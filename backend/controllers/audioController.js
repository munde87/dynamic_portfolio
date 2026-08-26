const Audio = require('../models/Audio');
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

// @desc    Get active audio for public website
// @route   GET /api/audio
// @access  Public
exports.getActiveAudio = async (req, res) => {
  try {
    const audio = await Audio.findOne({ isActive: true }).sort({ updatedAt: -1 });
    res.json({
      success: true,
      data: audio || null,
    });
  } catch (error) {
    console.error('Error fetching audio:', error);
    res.status(500).json({ success: false, message: 'Server error fetching audio.' });
  }
};

// @desc    Get audio settings (admin detail view)
// @route   GET /api/audio/settings
// @access  Private
exports.getAudioSettings = async (req, res) => {
  try {
    const audio = await Audio.findOne({ isActive: true }).sort({ updatedAt: -1 });
    res.json({
      success: true,
      data: audio || null,
    });
  } catch (error) {
    console.error('Error fetching audio settings:', error);
    res.status(500).json({ success: false, message: 'Server error fetching audio settings.' });
  }
};

// @desc    Upload new background audio
// @route   POST /api/audio
// @access  Private
exports.uploadAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an audio file (MP3, WAV, or OGG).' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileSize = req.file.size;
    const formattedSize = formatBytes(fileSize);
    const fileName = req.file.originalname || req.file.filename;

    // Remove any previous audio files from disk
    const previousAudios = await Audio.find({});
    for (const old of previousAudios) {
      if (old.fileUrl) {
        const oldPath = path.join(__dirname, '..', old.fileUrl);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) {}
        }
      }
    }
    await Audio.deleteMany({});

    const newAudio = await Audio.create({
      fileName,
      fileUrl,
      fileType: req.file.mimetype || 'audio/mpeg',
      fileSize,
      formattedSize,
      isActive: true,
      isEnabled: true,
      defaultVolume: 20,
      uploadedAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Background audio uploaded successfully!',
      data: newAudio,
    });
  } catch (error) {
    console.error('Error uploading audio:', error);
    res.status(500).json({ success: false, message: 'Server error uploading audio.' });
  }
};

// @desc    Replace current background audio
// @route   PUT /api/audio
// @access  Private
exports.replaceAudio = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a new audio file to replace.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const fileSize = req.file.size;
    const formattedSize = formatBytes(fileSize);
    const fileName = req.file.originalname || req.file.filename;

    // Preserve settings from old record
    const oldRecord = await Audio.findOne({ isActive: true });
    const preservedVolume = oldRecord?.defaultVolume ?? 20;
    const preservedEnabled = oldRecord?.isEnabled ?? true;

    // Delete old files from disk
    const existing = await Audio.find({});
    for (const old of existing) {
      if (old.fileUrl) {
        const oldPath = path.join(__dirname, '..', old.fileUrl);
        if (fs.existsSync(oldPath)) {
          try { fs.unlinkSync(oldPath); } catch (e) {}
        }
      }
    }
    await Audio.deleteMany({});

    const updatedAudio = await Audio.create({
      fileName,
      fileUrl,
      fileType: req.file.mimetype || 'audio/mpeg',
      fileSize,
      formattedSize,
      isActive: true,
      isEnabled: preservedEnabled,
      defaultVolume: preservedVolume,
      uploadedAt: new Date(),
      updatedAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Background audio replaced successfully!',
      data: updatedAudio,
    });
  } catch (error) {
    console.error('Error replacing audio:', error);
    res.status(500).json({ success: false, message: 'Server error replacing audio.' });
  }
};

// @desc    Update audio settings (enable/disable, volume)
// @route   PATCH /api/audio/settings
// @access  Private
exports.updateAudioSettings = async (req, res) => {
  try {
    const audio = await Audio.findOne({ isActive: true });
    if (!audio) {
      return res.status(404).json({ success: false, message: 'No active audio found. Upload audio first.' });
    }

    const { isEnabled, defaultVolume } = req.body;

    if (typeof isEnabled === 'boolean') {
      audio.isEnabled = isEnabled;
    }
    if (typeof defaultVolume === 'number' && defaultVolume >= 0 && defaultVolume <= 100) {
      audio.defaultVolume = defaultVolume;
    }

    audio.updatedAt = new Date();
    await audio.save();

    res.json({
      success: true,
      message: 'Audio settings updated successfully!',
      data: audio,
    });
  } catch (error) {
    console.error('Error updating audio settings:', error);
    res.status(500).json({ success: false, message: 'Server error updating audio settings.' });
  }
};

// @desc    Delete background audio
// @route   DELETE /api/audio
// @access  Private
exports.deleteAudio = async (req, res) => {
  try {
    const audios = await Audio.find({});
    for (const a of audios) {
      if (a.fileUrl) {
        const filePath = path.join(__dirname, '..', a.fileUrl);
        if (fs.existsSync(filePath)) {
          try { fs.unlinkSync(filePath); } catch (e) {}
        }
      }
    }

    await Audio.deleteMany({});

    res.json({
      success: true,
      message: 'Background audio deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting audio:', error);
    res.status(500).json({ success: false, message: 'Server error deleting audio.' });
  }
};
