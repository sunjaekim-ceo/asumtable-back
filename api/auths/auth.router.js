const express = require("express");
const passport = require("passport");
const router = express.Router();
const authTokenController = require("./authTokenController");

router.post("/login", authTokenController.create);
// router.get(
//   "/check",
//   passport.authenticate("jwt", { session: false }),
//   UserController.index
// );

// router.get("/", controller.);
// router.post("/register", controller.registerUser);
// router.post("/login", controller.loginLocal);
// router.get("/kakao", controller.loginKakao);
// router.post("/logout", controller.logoutUser);

// router.put("/", controller.);
// router.patch("/", controller.);
// router.delete("/", controller.);

module.exports = router;
