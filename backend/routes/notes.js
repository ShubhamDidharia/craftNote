const express = require('express');
const noteController = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All note routes require authentication
router.use(authMiddleware);

// @route   POST /api/notes
// @desc    Create a new note
router.post('/', noteController.createNote);

// @route   GET /api/notes
// @desc    Get all notes (with optional workspace filter)
router.get('/', noteController.getNotes);

// @route   GET /api/notes/:id
// @desc    Get specific note
router.get('/:id', noteController.getNote);

// @route   PUT /api/notes/:id
// @desc    Update note
router.put('/:id', noteController.updateNote);

// @route   DELETE /api/notes/:id
// @desc    Delete note
router.delete('/:id', noteController.deleteNote);

// @route   PUT /api/notes/:id/pin
// @desc    Toggle pin status
router.put('/:id/pin', noteController.togglePinNote);

module.exports = router;
