const express = require('express');
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/generate-title', aiController.generateTitle);
router.post('/writing-help', aiController.writingHelp);
router.post('/verify-content', aiController.verifyContent);

module.exports = router;
