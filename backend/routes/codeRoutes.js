const express = require('express');
const router = express.Router();
const codeController = require('../controllers/codeController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', codeController.getCodeExamples);
router.post('/', verifyToken, codeController.createCodeExample);
router.put('/:id', verifyToken, codeController.updateCodeExample);
router.delete('/:id', verifyToken, codeController.deleteCodeExample);

module.exports = router;
