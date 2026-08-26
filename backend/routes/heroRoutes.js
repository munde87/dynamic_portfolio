const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', heroController.getHero);
router.put('/', verifyToken, heroController.updateHero);

module.exports = router;
