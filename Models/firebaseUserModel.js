// backend/models/userModel.js
const mongoose = require('mongoose');

const FirebaseuserSchema = new mongoose.Schema({
  firebaseUID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'hr', 'counselor'],
    default: 'staff',
  },
  // Additional fields like name, profile picture, etc.
});

module.exports = mongoose.model('FirebaseUser', FirebaseuserSchema);
