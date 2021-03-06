const User = require("../users/model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const config = require("../config");
const { getToken } = require("../utils/get-token");

async function register(req, res, next) {
  try {
    const payload = req.body;

    let user = new User(payload);
    await user.save();

    return res.json(user);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
}

async function login(req, res, next) {
  passport.authenticate("local", async function (err, user) {
    // error
    if (err) return next(err);

    // user not exist
    if (!user) {
      return res.json({
        error: 1,
        message: "email or password incorrect",
      });
    }

    // user exist => (1) create jwt
    let signed = jwt.sign(user, config.secretKey);

    // (2) save jwt to user
    await User.findByIdAndUpdate(
      { _id: user._id },
      { $push: { token: signed } },
      { new: true }
    );

    // (3) res client
    return res.json({
      message: "Logged in succesfully",
      user: user,
      token: signed,
    });
  })(req, res, next);
}

async function localStrategy(email, password, done) {
  try {
    let user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -cart_items -token"
    ); // select "-createdAt ..." => select field except createdAt

    // user not exist
    if (!user) return done();

    // user exist
    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithOutPassword } = user.toJSON());

      // give data user without password
      return done(null, userWithOutPassword);
    }
  } catch (err) {
    done(err, null);
  }

  // password not maching
  done();
}

async function me(req, res, next) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `You are not login or token expired`,
    });
  }

  return res.json(req.user);
}

async function logout(req, res, next) {
  // get token from req
  let token = getToken(req);

  // delete token from user
  let user = await User.findOneAndUpdate(
    { token: { $in: [token] } },
    { $pull: { token } },
    {
      useFindAndModify: false,
    }
  );

  if (!user || !token) {
    return res.json({
      error: 1,
      message: "No user found",
    });
  }

  return res.json({
    error: 0,
    message: "Logout berhasil",
  });
}

module.exports = {
  register,
  localStrategy,
  login,
  me,
  logout,
};
