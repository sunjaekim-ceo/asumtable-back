// const passport = require("passport");
// const bcrypt = require("bcrypt");
// const { Strategy: LocalStrategy } = require("passport-local");
// const { Auth } = require("../models");

// module.exports = () => {
//   passport.use(
//     new LocalStrategy(
//       {
//         usernameField: "email",
//         passwordField: "password",
//         // nicknameField: "nickname",
//       },
//       async (email, password, done) => {
//         try {
//           const auth = await Auth.findOne({
//             where: { email },
//           });
//           console.log("11111111", typeof auth.password);

//           if (!auth) {
//             return done(null, false, { reason: "존재하지 않은 이메일입니다!" });
//           }
//           const result = await bcrypt.compare(password, auth.password);
//           if (result) {
//             return done(null, auth);
//           }
//           return done(null, false, { reason: "비밀번호가 틀렸습니다!" });
//         } catch (error) {
//           console.error(error);
//           return done(error);
//         }
//       }
//     )
//   );
// };
