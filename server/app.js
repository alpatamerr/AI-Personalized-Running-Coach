const express = require('express');
const { createServer } = require('http');
const cors = require('cors'); // Import cors
const passport = require('passport'); // Import passport
require('./config/authConfig'); // Google OAuth configuration
require('dotenv').config();
const session = require('express-session');
const goalRoutes = require('./routes/goalRoutes'); // Goal-related routes
const planRoutes = require('./routes/planRoutes'); // Plan-related routes
const stravaRoutes = require('./routes/stravaRoutes'); // Strava-related routes
const userRoutes = require('./routes/userRoutes'); // User-related routes
const authRoutes = require('./routes/authRoutes'); // Google and Strava auth routes
const errorHandler = require('./middleware/errorHandler'); // Error handler middleware

const app = express();

app.set('trust proxy', 1);
// Enable CORS first
app.use(
  cors({
    origin: 'http://localhost:5173', // Allow requests only from this frontend domain
    credentials: true, // Allow cookies or credentials
  })
);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: true,
  saveUninitialized: true,
  cookie: { 
    secure: false, // set to true in production with HTTPS
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());


// Default route for `/`
app.get('/', (req, res) => {
  res.send('Welcome to the AI Personalized Running Coach API!');
});

// Routes
app.use('/api/goals', goalRoutes); // Goal-related routes
app.use('/api/plans', planRoutes); // Plan-related routes
app.use('/api/strava', stravaRoutes); // Strava-related routes
app.use('/api/users', userRoutes); // User-related routes
app.use('/api/auth', authRoutes); // Google auth routes



// Global error handler
app.use(errorHandler);

// Process error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Application specific logging, throwing an error, or other logic here
});

// Graceful shutdown
const server = createServer(app);
const PORT = process.env.PORT || 5000;

let serverInstance = server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const shutdown = () => {
  console.log('Received kill signal, shutting down gracefully');
  serverInstance.close(() => {
    console.log('Closed out remaining connections');
    process.exit(0);
  });

  // If connections don't close within 10 seconds, forcefully shut down
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

// Listen for SIGTERM signal
process.on('SIGTERM', shutdown);
// Listen for SIGINT signal (Ctrl+C)
process.on('SIGINT', shutdown);

module.exports = app; // Export for testing purposes