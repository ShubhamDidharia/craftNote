const { jwtSecret, mongoUri, port: PORT } = require('./config/env');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Middleware
app.use(express.json());

// Basic security headers
app.use(helmet());

// Trust proxy when deployed behind a proxy (Render, Vercel, etc.)
app.set('trust proxy', true);

// Configure CORS to allow the frontend origin in production and allow all in development
const frontendUrl = process.env.FRONTEND_URL ||  '';
const isProd = process.env.NODE_ENV === 'production';

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser (e.g. server-side) requests that have no origin
    if (!origin) return callback(null, true);
    if (!isProd) return callback(null, true); // allow all in non-production

    const allowed = frontendUrl.split(',').map((s) => s.trim()).filter(Boolean);
    // If no explicit allowed origins are set, allow the provided FRONTEND_URL
    if (allowed.length === 0 && frontendUrl) allowed.push(frontendUrl);

    try {
      const originHost = new URL(origin).origin;
      if (allowed.includes(origin) || allowed.includes(originHost)) {
        return callback(null, true);
      }
    } catch (e) {
      // If parsing fails, deny
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

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
