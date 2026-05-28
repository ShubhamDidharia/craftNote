const { jwtSecret, mongoUri, port: PORT } = require('./config/env');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CraftNote API' });
});

// Import routes
const authRoutes = require('./routes/auth');
const workspaceRoutes = require('./routes/workspaces');
const noteRoutes = require('./routes/notes');
const aiRoutes = require('./routes/ai');

app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/ai', aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `Port ${PORT} is already in use. Stop the other process or run:\n` +
        `  netstat -ano | findstr :${PORT}\n` +
        `  taskkill /PID <pid> /F`
    );
    process.exit(1);
  }
  console.error('Server error:', error);
  process.exit(1);
});
