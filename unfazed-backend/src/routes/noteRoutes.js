const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getClientNotes,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');

router.use(protect);

router.route('/')
  .post(createNote);

router.route('/client/:clientId')
  .get(getClientNotes);

router.route('/:id')
  .put(updateNote)
  .delete(deleteNote);

module.exports = router;
