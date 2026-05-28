const express = require('express');
const workspaceController = require('../controllers/workspaceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All workspace routes require authentication
router.use(authMiddleware);

// @route   POST /api/workspaces
// @desc    Create a new workspace
router.post('/', workspaceController.createWorkspace);

// @route   GET /api/workspaces
// @desc    Get all user workspaces
router.get('/', workspaceController.getWorkspaces);

// @route   GET /api/workspaces/:id
// @desc    Get specific workspace
router.get('/:id', workspaceController.getWorkspace);

// @route   PUT /api/workspaces/:id
// @desc    Update workspace
router.put('/:id', workspaceController.updateWorkspace);

// @route   DELETE /api/workspaces/:id
// @desc    Delete workspace
router.delete('/:id', workspaceController.deleteWorkspace);

// @route   PUT /api/workspaces/:id/default
// @desc    Set as default workspace
router.put('/:id/default', workspaceController.setDefaultWorkspace);

module.exports = router;
