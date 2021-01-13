const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { Image, Tour } = require("../models");
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

router.post("/",isLoggedIn,upload.array("images", 12),async (req, res) => {
    try {
      const tourImg = await Promise.all(req.files.map((v) => Image.create({ src: v.filename,
        TourId: req.tour.id,
      })));
      console.log(req.files);
      res.status(201).end();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

module.exports = router;
