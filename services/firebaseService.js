// backend/services/firebaseService.js
const admin = require('../config/firebase');

// Function to assign role to a user in Firebase
const assignRoleToUser = async (uid, role) => {
  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    console.log(`Role ${role} assigned to user with UID: ${uid}`);
  } catch (error) {
    console.error('Error assigning role:', error);
  }
};

module.exports = { assignRoleToUser };
