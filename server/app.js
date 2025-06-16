const express = require('express');
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

// 2. Then session and passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    sameSite: 'lax',
   } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());


// Then parse JSON bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; // Export for testing purposes