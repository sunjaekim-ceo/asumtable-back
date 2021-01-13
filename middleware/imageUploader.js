const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");

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

  module.exports = upload;