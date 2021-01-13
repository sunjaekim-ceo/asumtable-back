// const passport = require("passport");
// const passportJWT = require("passport-jwt");
// const JWTStrategy = passportJWT.Strategy;
// const ExtractJWT = passportJWT.ExtractJwt;
// const LocalStrategy = require("passport-local").Strategy;
// const dotenv = require("dotenv");

// dotenv.config();

const passport = require("passport");
const bcrypt = require("bcrypt");
const { Strategy: LocalStrategy } = require("passport-local");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { email },
          });
          console.log("11111111", typeof user.password);

          if (!user) {
            return done(null, false, { reason: "존재하지 않은 이메일입니다!" });
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          }
          return done(null, false, { reason: "비밀번호가 틀렸습니다!" });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
