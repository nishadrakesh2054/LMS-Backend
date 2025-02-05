const admin = require("../config/firebaseAdmin");

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid Token" });
    }
};

// Middleware for Role-Based Access
const checkRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.user && req.user.role === requiredRole) {
            next();
        } else {
            return res.status(403).json({ message: "Access Denied" });
        }
    };
};

module.exports = { verifyToken, checkRole };
