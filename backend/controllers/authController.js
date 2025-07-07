const User = require('../models/User');

// ✅ Signup
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 🔒 Check if username already exists
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // 🔒 Check if email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // ✅ Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.password !== password)
      return res.status(400).json({ message: 'Invalid credentials' });

    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Change Password
exports.changePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.password !== currentPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    if (
      user.password === newPassword ||
      user.passwordHistory.includes(newPassword)
    ) {
      return res.status(400).json({ message: 'New password must not match the last 3 passwords' });
    }

    // Update password and history
    user.passwordHistory.unshift(user.password); // push current password to history
    if (user.passwordHistory.length > 3) {
      user.passwordHistory = user.passwordHistory.slice(0, 3); // keep last 3 only
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
