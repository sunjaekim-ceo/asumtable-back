// const passport = require("passport");
// const dotenv = require("dotenv");
// const { Strategy: KakaoStrategy } = require("passport-kakao");
// const { Auth } = require("../models");

// dotenv.config();

// module.exports = () => {
//   passport.use(
//     new KakaoStrategy(
//       {
//         clientID: process.env.KAKAO_CLIENT_ID,
//         clientSecret: process.env.KAKAO_CLIENT_SECRET,
//         callbackURL: "http://localhost:3000/oauth",
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         try {
//           const checkAuth = await Auth.find({
//             where: { kakao_id: profile.id, provider: "kakao" },
//           });
//           if (checkAuth) {
//             done(null, checkAuth);
//           } else {
//             const newAuth = await Auth.create({
//               email: profile._json && profile._json.kaccount_email,
//               nickname: profile.displayName,
//               kakao_id: profile.id,
//               provider: "kakao",
//             });
//             done(null, newAuth);
//           }
//         } catch (error) {
//           console.error(error);
//           done(error);
//         }
//       }
//     )
//   );
// };
