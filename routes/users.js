const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { Auth, User, Order, Image, Tour, Review } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("../middleware/loginState");

try {
  fs.accessSync("img");
} catch (error) {
  console.log("img 폴더가 없으므로 생성합니다.");
  fs.mkdirSync("img");
}

// multer
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "img/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname); //확장자 추출
      const basename = path.basename(file.originalname, ext); //파일명
      cb(null, basename + "_" + new Date().getTime() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get("/", isLoggedIn, async (req, res, next) => {
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

router.get("/landing", async (req, res, next) => {
  try {
    const myTour = await Tour.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Review,
          attributes: ["rating"],
        },
        {
          model: Image,
          attributes: ["src"],
        },
      ],
    });
    res.status(201).json(myTour);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/account", isLoggedIn, async (req, res, next) => {
  try {
    const myAccount = await User.findOne({
      where: {
        id: req.user.id,
      },
    });
    console.log(myAccount);
    res.status(201).json(myAccount);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put("/account", async (req, res, next) => {
  try {
    const checkUser = await User.findOne({
      where: {
        id: req.user.id,
      },
      attributes: {
        exclude: ["password"],
      },
    });
    // console.log(checkUser);
    if (!checkUser) {
      return res.status(403).json("본인의 정보만 수정하실 수 있습니다.");
    }
    console.log(checkUser);
    const updateUser = await User.update(
      {
        id: req.user.id,
        username: req.body.username,
        phone_number: req.body.phone_number,
        driver_license: req.body.driver_license,
        social_number: req.body.social_number,
        bank_account: req.body.bank_account,
        about: req.body.about,
        year: req.body.year,
        month: req.body.month,
        day: req.body.day,
      },
      {
        where: {
          id: req.user.id,
        },
        attributes: {
          exclude: ["password"],
        },
      }
    );
    console.log(updateUser);
    res.redirect(201, "/api/user/account");
    // res.status(201).json(updateUser);
    console.log(res);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post(
  "/profile",
  isLoggedIn,
  upload.single("image"),
  async (req, res) => {
    // 게스트 이미지 업로드
    console.log(req.user);
    try {
      const checkUser = await User.findOne({
        where: {
          id: req.user.id,
        },
        attributes: {
          exclude: ["password"],
        },
      });
      if (!checkUser) {
        return res.status(403).json("본인의 계정이 아닙니다.");
      }
      console.log(req.file);
      const userImg = await User.update(
        {
          image: `${req.file.filename}`,
        },
        {
          where: {
            id: req.user.id,
          },
          attributes: {
            exclude: ["password"],
          },
        }
      );
      res.status(201).end();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

// router.post(
//   "/image",
//   isLoggedIn,
//   upload.single("image"),
//   async (req, res, next) => {
//     try {
//       console.log(req.files);
//       res.json(req.files.map((v) => v.filename));
//       const uploadUserImage = await User.update({
//         image: req.files.map((v) => v.filename),
//       });
//       res.status(201).json({ uploadUserImage });
//     } catch (error) {
//       console.error(error);
//       next(error);
//     }
//   }
// );

// router.put("/account", isLoggedIn, async (req, res, next) => {
//   try {
//     const myAccount = await User.findAll({
//       where: {
//         id: req.session.id,
//       },
//     });
//     res.status(201).json(myAccount);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

module.exports = router;
