const router = require("express").Router();
const multer = require("multer");
const controller = require("./controller");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// post register
router.post("/register", multer().none(), controller.register);

// post login
router.post("/login", multer().none(), controller.login);

// passport => by default request contain username and password
passport.use(
  new LocalStrategy({ usernameField: "email" }, controller.localStrategy)
);

module.exports = router;
