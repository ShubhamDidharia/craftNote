const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a note title'],
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    content: {
      type: String,
      default: '',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPinned: {
      type: Boolean,
      default: false,
    },
    colorTheme: {
      type: String,
      default: 'classic',
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
noteSchema.index({ userId: 1, workspaceId: 1 });
noteSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Note', noteSchema);
