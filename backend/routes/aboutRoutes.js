const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', aboutController.getAbout);
router.put('/', verifyToken, aboutController.updateAbout);

module.exports = router;
