const Workspace = require('../models/Workspace');
const Note = require('../models/Note');

// @route   POST /api/workspaces
// @desc    Create a new workspace
// @access  Private
exports.createWorkspace = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const userId = req.user.id;

    // Validation
    if (!name) {
      return res.status(400).json({ error: 'Workspace name is required' });
    }

    // Create workspace
    const workspace = new Workspace({
      name,
      description: description || '',
      color: color || '#667eea',
      userId,
    });

    await workspace.save();

    res.status(201).json({
      message: 'Workspace created successfully',
      workspace,
    });
  } catch (error) {
    console.error('Create workspace error:', error);
    res.status(500).json({ error: 'Error creating workspace' });
  }
};

// @route   GET /api/workspaces
// @desc    Get all workspaces for the current user
// @access  Private
exports.getWorkspaces = async (req, res) => {
  try {
    const userId = req.user.id;

    const workspaces = await Workspace.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      workspaces,
      total: workspaces.length,
    });
  } catch (error) {
    console.error('Get workspaces error:', error);
    res.status(500).json({ error: 'Error fetching workspaces' });
  }
};

// @route   GET /api/workspaces/:id
// @desc    Get a specific workspace
// @access  Private
exports.getWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Verify ownership
    if (workspace.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to access this workspace' });
    }

    res.status(200).json({ workspace });
  } catch (error) {
    console.error('Get workspace error:', error);
    res.status(500).json({ error: 'Error fetching workspace' });
  }
};

// @route   PUT /api/workspaces/:id
// @desc    Update a workspace
// @access  Private
exports.updateWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, color, isDefault } = req.body;
    const userId = req.user.id;

    let workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Verify ownership
    if (workspace.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this workspace' });
    }

    // Update fields
    if (name) workspace.name = name;
    if (description !== undefined) workspace.description = description;
    if (color) workspace.color = color;
    if (isDefault !== undefined) workspace.isDefault = isDefault;

    await workspace.save();

    res.status(200).json({
      message: 'Workspace updated successfully',
      workspace,
    });
  } catch (error) {
    console.error('Update workspace error:', error);
    res.status(500).json({ error: 'Error updating workspace' });
  }
};

// @route   DELETE /api/workspaces/:id
// @desc    Delete a workspace and cascade delete all notes
// @access  Private
exports.deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Verify ownership
    if (workspace.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this workspace' });
    }

    await Note.deleteMany({ workspaceId: id, userId });
    await Workspace.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Workspace deleted successfully',
    });
  } catch (error) {
    console.error('Delete workspace error:', error);
    res.status(500).json({ error: 'Error deleting workspace' });
  }
};

// @route   GET /api/workspaces/:id/default
// @desc    Set a workspace as default
// @access  Private
exports.setDefaultWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    // Verify ownership
    if (workspace.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this workspace' });
    }

    workspace.isDefault = true;
    await workspace.save();

    res.status(200).json({
      message: 'Default workspace updated successfully',
      workspace,
    });
  } catch (error) {
    console.error('Set default workspace error:', error);
    res.status(500).json({ error: 'Error setting default workspace' });
  }
};
