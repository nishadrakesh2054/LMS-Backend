const admin = require("../config/firebaseAdmin");
const FirebaseUser = require("../Models/authModel");


// register a new user
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    const newUser = new FirebaseUser({
      firebaseUID: userRecord.uid,
      name,
      email,
      role,
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get all a new user
const getAllUsers = async (req, res) => {
  try {
    const users = await FirebaseUser.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assign role to a user
const assignRole = async (req, res) => {
  const { email, role } = req.body;

  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { role });
    await FirebaseUser.findOneAndUpdate({ firebaseUID: user.uid }, { role });

    return res.json({ message: `Role ${role} assigned to ${email}` });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Get user role
const getUserRole = async (req, res) => {
  try {
    const user = await admin.auth().getUser(req.user.uid);
    return res.json({ role: user.customClaims?.role || "user" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// ✅ Login User
// 🔹 User Login (Firebase handles login, but we verify token)
const loginUser = async (req, res) => {
    const { token } = req.body; // Firebase ID Token from frontend
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const user = await FirebaseUser.findOne({ firebaseUID: decodedToken.uid });
  
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json({ message: "Login successful", user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
module.exports = {
  assignRole,
  getUserRole,
  registerUser,
  loginUser,
  getAllUsers,
};
