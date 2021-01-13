var express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { User } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("../middleware/loginState");
const db = require("../models");

var router = express.Router();
/* GET users listing. */
router.get("/", async (req, res, next) => {
  try {
    if (req.user) {
      const fullState = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        },
      });
      res.status(200).json(fullState);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/register", isNotLoggedIn, async (req, res, next) => {
  try {
    console.log(req.body);
    const registerUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (registerUser) {
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      year: req.body.year,
      month: req.body.month,
      day: req.body.day,
      gender: req.body.gender,
      // host_approval: req.body.host_approval,
    });
    res.status(201).send({ redirect: "/api/user/landing" });
  } catch (error) {
    console.error(error);
    next(error); //status 500
  }
});

// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", { session: false }, (err, user, info) => {
//     if (err) {
//       console.error(err);
//       return next(err);
//     }
//     if (info) {
//       return res.status(401).send(info.reason);
//     }
//     return req.login(user, { session: false }, async (loginErr) => {
//       if (loginErr) {
//         console.error(loginErr);
//         return next(loginErr);
//       }
//       const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET);
//       return res.json({ user, token });
//     });
//   })(req, res, next);
//   res.redirect("/user/" + req.user.username);
// });

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullState = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["password"],
        },
      });
      return res.status(200).json(fullState);
    });
  })(req, res, next);
});

// 1. /user/kakao로 로그인 요청
router.get("/kakao", passport.authenticate("kakao"));

// 3. /user/kakao/callback으로 프로필 반환
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);
// done에 오류값이 전달되면 "/"로 리다이렉트합니다.

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.send("ok");
});

module.exports = router;
