const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Register a new user
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  try {
    // Check if the email already exists
    const emailExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailExists.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Email is already in use.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database with is_strava_user set to false
    const result = await pool.query(
      'INSERT INTO users (username, email, password, is_strava_user) VALUES ($1, $2, $3, $4) RETURNING id',
      [username, email, hashedPassword, false]
    );

    res.json({ success: true, userId: result.rows[0].id });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'All fields are required.' });
  }

  try {
    console.log('Login request received for email:', email);

    // Find the user by email and check if they are a regular user (not a Strava user)
    const user = await pool.query(
      'SELECT id, password, is_strava_user FROM users WHERE email = $1',
      [email]
    );

    console.log('User fetched from database:', user.rows);

    if (user.rows.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid email or password.' });
    }

    const userData = user.rows[0];

    // If user is a Strava user, they should use Strava login
    if (userData.is_strava_user) {
      return res.status(400).json({ 
        success: false, 
        error: 'This account is connected to Strava. Please use Strava login instead.' 
      });
    }

    const storedHashedPassword = userData.password;

    // Compare the password
    const isMatch = await bcrypt.compare(password, storedHashedPassword);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Invalid email or password.' });
    }

    res.json({ success: true, userId: userData.id });
  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
};

module.exports = { registerUser, loginUser };