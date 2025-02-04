// const jwt = require("jsonwebtoken");
// const User = require("../Models/UserSchema");
// const JWT_SECRETE_KEY = process.env.JWT_SECRETE_KEY || rolexbhai123; 

// const checkIsUserAuthenticated = async (req, res, next) => {
//   try {
//     const bearerToken = req.headers.authorization;

//     if (typeof bearerToken !== "undefined") {
//       const token = bearerToken.split(" ")[1];
//       jwt.verify(token, process.env.JWT_SECRETE_KEY, async (err, authData) => {
//         if (err) {
//           console.log(err);
//           return res.status(403).json({
//             success: false,
//             message: "access denied",
//           });
//         } else {
//           const userFound = await User.findById(authData.userId);

//           if (!userFound) {
//             return res.status(404).json({
//               message: "user not found",
//             });
//           }

//           req.headers.authData = authData;
//           req.userAuthenticated = userFound;
//           next();
//         }
//       });
//     } else {
//       console.log("smthng went wrong validating token");
//       return res.status(403).json({
//         message: "no token found in req",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: error,
//     });
//   }
// };

// module.exports = { checkIsUserAuthenticated };















// backend/middlewares/authMiddleware.js
const admin = require('../config/firebase');

const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from the 'Authorization' header
  
  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken; // Attach decoded token to the request
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired token.' });
  }
};

// Middleware to check user role
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'You do not have permission to access this resource.' });
    }
    next();
  };
};

module.exports = { verifyToken, checkRole };
