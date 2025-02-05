const express = require("express");
const {
  assignRole,
  getUserRole,
  registerUser,
  getAllUsers,
  loginUser
} = require("../Controllers/authController");
const {
  verifyToken,
  checkRole,
} = require("../middleware/firebaseAuthMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/assign-role", verifyToken, checkRole("admin"), assignRole);
router.get("/allusers", verifyToken, checkRole("admin"), getAllUsers);
router.get("/user-role", verifyToken, getUserRole);

module.exports = router;
