const Message = require('../models/Message');

// @desc    Get chat history with a client
// @route   GET /api/chat/:clientId
// @access  Private
const getChatHistory = async (req, res, next) => {
  try {
    const messages = await Message.find({
      therapistId: req.therapist._id,
      clientId: req.params.clientId
    }).sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    next(error);
  }
};

// @desc    Send a message to a client
// @route   POST /api/chat/:clientId
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    
    const message = await Message.create({
      therapistId: req.therapist._id,
      clientId: req.params.clientId,
      senderModel: 'Therapist',
      senderId: req.therapist._id,
      text
    });

    // In a real app, emit via socket.io here or handle in socket controller
    
    res.status(201).json({ success: true, message });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChatHistory,
  sendMessage,
};
