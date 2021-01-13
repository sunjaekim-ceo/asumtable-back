const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const { Test, Image, Host, User, Tour } = require("../models");
const { isLoggedIn } = require("../middleware/loginState");

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

router.post(
  "/images",
  isLoggedIn,
  upload.single("images"),
  async (req, res) => {
    try {
      // const tourImg = await Promise.all(
      //   req.files.map((v) =>
      //     Test.create({
      //       src: v.filename,
      //       // TourId: req.tour.id,
      //     })
      //   )
      // );
      // console.log(req.files);
      // return res.status(201).json(tourImg);
      const userImg = await Test.create({
        src: `${req.file.filename}`,
      });
      return res.json({
        success: true,
        filePath: res.req.file.path,
        fileName: res.req.file.filename,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

module.exports = router;

// // AWS-S3 설정
// AWS.config.update({
//   accessKeyId: process.env.S3_ACCESS_KEY_ID,
//   secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//   region: "ap-northeast-2",
// });

// // MULTER-S3 설정
// const upload = multer({
//   storage: multerS3({
//     s3: new AWS.S3(),
//     bucket: "asumtable-v1.0-s3",
//     key(req, file, cb) {
//       cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`);
//     },
//   }),
//   limits: { fileSize: 10 * 1024 * 1024 },
// });

//이미지 저장 위치 맴핑
// router.post(
//   "/apply/image",
//   isLoggedIn,
//   upload.single("images"),
//   (req, res, next) => {
//     console.log(req.files);
//     res.json(req.files.map((v) => v.filename));
//   }
// );
