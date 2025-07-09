// models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // ✅ This is the key fix
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  // ✅ Added field: stores last 3 passwords for change-password validation
  passwordHistory: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('User', UserSchema);
