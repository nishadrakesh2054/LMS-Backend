const User = require("../Models/authModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// -------------------registration process-----------
const register = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, password, roles } = req.body;
    // Check if the user already exists
    const userExists = await User.findOne({email });
    if (userExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const newUser = new User({
      name,
      email,
      roles,
      password: hashedPassword,
    });
    await newUser.save(); 

    // Send a success message with the created user details (excluding the password)
    setTimeout(() => {
      res.status(201).json({
        success: true,
        message: "Admin created successfully",
        newUser: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    }, 2000);
  } catch (error) {
    
    console.error("Error in registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// -------------------login processs-------------
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Compare the provided password with the stored hashed password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Password matches, create a JWT token
  const token = jwt.sign(
    { userId: user._id, roles: user.roles },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  // Password matches, successful login
  res.status(200).json({
    success: true,
    message: "Login successful",
    token: `Bearer ${token}`,
    name: user.name,
    roles: user.roles,
  });
});

// Get All Users (Admin Only)
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error in getting users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//--------------------logout user-------------
const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
});

module.exports = {
  register,
  login,
  getAllUsers,
  logout,
};
