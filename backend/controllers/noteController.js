const Note = require('../models/Note');
const Workspace = require('../models/Workspace');

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
exports.createNote = async (req, res) => {
  try {
    const { title, content, workspaceId, tags, color } = req.body;
    const userId = req.user.id;

    // Validation
    if (!title) {
      return res.status(400).json({ error: 'Note title is required' });
    }

    if (!workspaceId) {
      return res.status(400).json({ error: 'Workspace ID is required' });
    }

    // Verify workspace exists and belongs to user
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace || workspace.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Workspace not found or not authorized' });
    }

    // Create note
    const note = new Note({
      title,
      content: content || '',
      userId,
      workspaceId,
      tags: tags || [],
      color: color || '#fef3c7',
    });

    await note.save();

    // Add note to workspace
    workspace.notes.push(note._id);
    await workspace.save();

    res.status(201).json({
      message: 'Note created successfully',
      note,
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Error creating note' });
  }
};

// @route   GET /api/notes
// @desc    Get all notes for user (optionally filtered by workspace)
// @access  Private
exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { workspaceId } = req.query;

    let query = { userId };
    if (workspaceId) {
      query.workspaceId = workspaceId;
    }

    const notes = await Note.find(query)
      .sort({ isPinned: -1, createdAt: -1 });

    res.status(200).json({
      notes,
      total: notes.length,
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Error fetching notes' });
  }
};

// @route   GET /api/notes/:id
// @desc    Get a specific note
// @access  Private
exports.getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Verify ownership
    if (note.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to access this note' });
    }

    res.status(200).json({ note });
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ error: 'Error fetching note' });
  }
};

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, isPinned, color } = req.body;
    const userId = req.user.id;

    let note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Verify ownership
    if (note.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this note' });
    }

    // Update fields
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;
    if (color !== undefined) note.color = color;

    await note.save();

    res.status(200).json({
      message: 'Note updated successfully',
      note,
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Error updating note' });
  }
};

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Verify ownership
    if (note.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this note' });
    }

    // Remove note from workspace
    await Workspace.findByIdAndUpdate(
      note.workspaceId,
      { $pull: { notes: id } }
    );

    // Delete note
    await Note.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Error deleting note' });
  }
};

// @route   PUT /api/notes/:id/pin
// @desc    Toggle pin status of a note
// @access  Private
exports.togglePinNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    let note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Verify ownership
    if (note.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this note' });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.status(200).json({
      message: 'Note pin status updated',
      note,
    });
  } catch (error) {
    console.error('Toggle pin note error:', error);
    res.status(500).json({ error: 'Error updating note' });
  }
};
