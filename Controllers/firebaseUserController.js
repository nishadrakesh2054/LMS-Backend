// backend/controllers/userController.js
const { assignRoleToUser } = require("../services/firebaseService");

// Controller to create a new user and assign a role
const createUser = async (req, res) => {
  const { uid, email, role ,name} = req.body;

  try {
    // Create user in Firebase
    await assignRoleToUser(uid, role);

    res
      .status(200)
      .json({ message: "User created and role assigned successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user.", error: error.message });
  }
};

module.exports = { createUser };
