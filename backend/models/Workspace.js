const mongoose = require('mongoose');

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a workspace name'],
      trim: true,
      minlength: 1,
      maxlength: 50,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    colorTheme: {
      type: String,
      default: 'classic',
    },
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Note',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Workspace', workspaceSchema);
