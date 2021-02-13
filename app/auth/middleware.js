const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../users/model");
const { getToken } = require("../utils/get-token");

function decodeToken() {
  return async function (req, res, next) {
    try {
      let token = getToken(req);

      if (!token) next();

      // verify token
      req.user = jwt.verify(token, config.secretKey);

      // search token user
      let user = await User.findOne({ token: { $in: [token] } });

      // token expired is user not found
      if (!user) {
        return res.json({
          error: 1,
          message: "Token expired",
        });
      }
    } catch (err) {
      if (err && err.name === "JsonWebTokenError") {
        return res.json({
          error: 1,
          message: err.message,
        });
      }

      next(err);
    }

    return next();
  };
}

module.exports = {
  decodeToken,
};
