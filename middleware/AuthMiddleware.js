const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Auth = require("../Models/authModel");

// Middleware to protect routes (checks if user is logged in)
const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

         
      const user = await Auth.findOne({
        where: { id: decoded.userId }, 
        attributes: { exclude: ["password"] }, 
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      req.user = user; 
        next();
      } catch (error) {
        console.error("Token validation failed", error);
        res.status(401).json({ message: "Not authorized, token failed" });
      }
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  });

// Middleware for Role-Based Access Control
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.user || !allowedRoles.includes(req.user.roles)) {
        return res.status(403).json({ message: "Access denied" });
      }
      next();
    };
};

module.exports = { protect, authorizeRoles };


