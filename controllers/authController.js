const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Login logic
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Save token to user record
    user.token = token;
    await user.save();

    res.json({ token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Logout logic
const logout = async (req, res) => {
  const userEmail = req.user.email;

  try {
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Invalidate token
    user.token = null;
    await user.save();

    res.json({ message: 'Successfully logged out' });
  } catch (err) {
    console.error("Error logging out user:", err);
    res.status(500).json({ message: 'Error logging out', error: err.message });
  }
};

// Get user data
const getUserData = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return limited user info (excluding password and token)
    res.json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: 'Error fetching user data', error: err.message });
  }
};

module.exports = {
  login,
  logout,
  getUserData,
};
