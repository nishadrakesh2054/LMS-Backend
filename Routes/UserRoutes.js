const express = require("express");
const router = express.Router();
const { checkIsUserAuthenticated } = require("../middleware/AuthMiddleware");

const usercontroller = require("../Controllers/user-controller");

router.route("/stat").get(usercontroller.checkServerStatus);

router.route("/register").post(usercontroller.register);
router.route("/login").post(usercontroller.login);
router.route("/logout").get(usercontroller.logout);
router
  .route("/changepassword")
  .post(checkIsUserAuthenticated, usercontroller.changePassword);
router
  .route("/forgetpassword")
  .post(checkIsUserAuthenticated, usercontroller.forgetpassword);
router
  .route("/resetpassword/:id/:resetToken")
  .post(checkIsUserAuthenticated, usercontroller.resetPassword);
router
  .route("/userTokenValidation")
  .get(checkIsUserAuthenticated, usercontroller.getUserByToken);
module.exports = router;
