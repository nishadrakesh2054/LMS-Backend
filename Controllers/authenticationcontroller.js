const Auth = require("../Models/authModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// -------------------registration process-----------
const register = asyncHandler(async (req, res, next) => {
    try {
      const { name, email, password, roles } = req.body;
  
     
     // Check if the user already exists
     const userExists = await Auth.findOne({ where: { email } });
     if (userExists) {
       return res.status(400).json({ message: "User already exists" });
     }
  
         // Ensure roles is a valid ENUM value
    const validRoles = ["admin", "teacher", "student", "librarian", "HR", "counselor"];
    if (roles && !validRoles.includes(roles)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }
  
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create the new user with the specified roles
      const newUser = await Auth.create({
        name,
        email,
        roles: roles || "student",
        password: hashedPassword,
      });
      
  
      res.status(201).json({
        success: true,
        message: "User created successfully",
        newUser: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          roles: newUser.roles,
        },
      });
    } catch (error) {
      console.error("Error in registration:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  

// -------------------login processs-------------
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if the user exists
  const user = await Auth.findOne({ where: { email } });

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
    { userId: user.id, roles: user.roles },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  // Password matches, successful login
  res.status(200).json({
    success: true,
    message: "Login successful",
    token: ` ${token}`,
    name: user.name,
    roles: user.roles,
  });
});

// Get All Users (Admin Only)
const getAllUsers = asyncHandler(async (req, res) => {
    try {
      const users = await Auth.findAll({
        attributes: { exclude: ["password"] }, 
      });
      res.json({ success: true, users });
    } catch (error) {
      console.error("Error in getting users:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  



//--------------------logout user-------------
const logout = asyncHandler(async (req, res) => {
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
