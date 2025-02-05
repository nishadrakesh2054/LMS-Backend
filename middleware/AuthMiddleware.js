const jwt = require("jsonwebtoken");
const User = require("../Models/UserSchema");
const JWT_SECRETE_KEY = process.env.JWT_SECRETE_KEY || rolexbhai123; 

const checkIsUserAuthenticated = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;

    if (typeof bearerToken !== "undefined") {
      const token = bearerToken.split(" ")[1];
      jwt.verify(token, process.env.JWT_SECRETE_KEY, async (err, authData) => {
        if (err) {
          console.log(err);
          return res.status(403).json({
            success: false,
            message: "access denied",
          });
        } else {
          const userFound = await User.findById(authData.userId);

          if (!userFound) {
            return res.status(404).json({
              message: "user not found",
            });
          }

          req.headers.authData = authData;
          req.userAuthenticated = userFound;
          next();
        }
      });
    } else {
      console.log("smthng went wrong validating token");
      return res.status(403).json({
        message: "no token found in req",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error,
    });
  }
};

module.exports = { checkIsUserAuthenticated };


