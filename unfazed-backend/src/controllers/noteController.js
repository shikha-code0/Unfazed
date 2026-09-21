const Note = require('../models/Note');

// @desc    Get all notes for a client
// @route   GET /api/notes/client/:clientId
// @access  Private
const getClientNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ 
      therapistId: req.therapist._id,
      clientId: req.params.clientId
    }).sort({ createdAt: -1 });
    
    res.json({ success: true, notes });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res, next) => {
  try {
    const { clientId, sessionId, title, content, type } = req.body;
    
    const note = await Note.create({
      therapistId: req.therapist._id,
      clientId,
      sessionId,
      title,
      content,
      type
    });

    res.status(201).json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, therapistId: req.therapist._id });
    
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (note.status === 'signed') {
      return res.status(403).json({ success: false, message: 'Cannot edit a signed note' });
    }

    const { title, content, type, status } = req.body;

    if (title) note.title = title;
    if (content) note.content = content;
    if (type) note.type = type;
    
    if (status === 'signed') {
      note.status = 'signed';
      note.signedAt = new Date();
    }

    await note.save();

    res.json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClientNotes,
  createNote,
  updateNote,
};
