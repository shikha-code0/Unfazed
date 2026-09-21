const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getChatHistory,
  sendMessage,
} = require('../controllers/chatController');

router.use(protect);

router.route('/:clientId')
  .get(getChatHistory)
  .post(sendMessage);

module.exports = router;
