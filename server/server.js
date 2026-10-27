import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import { seedDatabase } from './seeds/seedEvents.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhive';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS Middleware
app.use(
  cors({
    origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: 'OK',
    application: 'EventHive — College Event Platform API',
    database: isConnected ? 'connected' : 'disconnected',
    databaseName: mongoose.connection.name || 'eventhive',
    mongoHost: '127.0.0.1:27017',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/clubs', clubRoutes);

// Root Welcome
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to EventHive API — College Event Platform',
    status: 'Running',
    database: mongoose.connection.readyState === 1 ? 'MongoDB Connected' : 'MongoDB Disconnected',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth (login, register, me, profile)',
      events: '/api/events (get all, featured, create, stats)',
      registrations: '/api/registrations (rsvp, my-tickets, cancel)',
      clubs: '/api/clubs (campus clubs directory)',
    },
    version: '1.0.0',
  });
});

// 404 Not Found Handler for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found on EventHive Server.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('EventHive Server Error:', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
});

// MongoDB Connection & Auto-Seed
let server;

const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB Community Server at:', MONGO_URI);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(' MongoDB connected successfully!');
    console.log(` Database: ${mongoose.connection.name}`);
    console.log(' MongoDB Compass Connection URI: ' + MONGO_URI);

    // Auto-seed sample events and demo users if database is empty
    await seedDatabase();
  } catch (error) {
    console.error(' MongoDB connection failed!');
    console.error('Error detail:', error.message);
    console.error('\nMongoDB Troubleshooting for Windows:');
    console.error('1. Press Windows Key + R, type services.msc, and press Enter.');
    console.error('2. Locate "MongoDB Server (MongoDB)" and verify the status is "Running".');
    console.error('3. Or start via PowerShell (Admin): Start-Service MongoDB (or net start MongoDB)');
    console.error('4. MongoDB Community Server download: https://www.mongodb.com/try/download/community\n');
  }
};

// Event Listeners for MongoDB connection lifecycle
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB connection disconnected.');
});

mongoose.connection.on('reconnected', () => {
  console.log(' MongoDB connection restored.');
});

// Start Server
const startServer = async () => {
  await connectDB();

  server = app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(` EventHive Server listening on http://localhost:${PORT}`);
    console.log(` Client URL: ${CLIENT_URL}`);
    console.log(` Health Check: http://localhost:${PORT}/api/health`);
    console.log(` MongoDB Compass URI: ${MONGO_URI}`);
    console.log(`======================================================\n`);
  });
};

// Graceful Shutdown
const handleShutdown = async (signal) => {
  console.log(`\n${signal} received. Initiating graceful shutdown...`);
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');
    });
  }
  await mongoose.connection.close(false);
  console.log('MongoDB connection closed.');
  process.exit(0);
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

startServer();
