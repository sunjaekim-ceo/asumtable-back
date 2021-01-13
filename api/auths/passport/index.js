// const passport = require("passport");
// const local = require("./local");
// const kakao = require("./kakao");
// const { Auth } = require("../models");

// module.exports = () => {
//   passport.serializeUser((auth, done) => {
//     return done(null, auth.id);
//   });

//   passport.deserializeUser(async (id, done) => {
//     try {
//       const auth = await Auth.findOne({ where: { id } });
//       return done(null, auth); // req.auth
//     } catch (error) {
//       console.error(error);
//       return done(error);
//     }
//   });

//   local();
//   kakao();
// };
