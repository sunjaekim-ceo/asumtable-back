const passport = require("passport");
const dotenv = require("dotenv");
const { Strategy: KakaoStrategy } = require("passport-kakao");
const { User } = require("../models");

dotenv.config();

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/oauth",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const checkUser = await User.find({
            where: { kakao_id: profile.id, provider: "kakao" },
          });
          if (checkUser) {
            done(null, checkUser);
          } else {
            const newUser = await User.create({
              email: profile._json && profile._json.kaccount_email,
              nickname: profile.displayName,
              kakao_id: profile.id,
              provider: "kakao",
            });
            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
