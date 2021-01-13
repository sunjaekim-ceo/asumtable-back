const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { Host, Tour, Review, Image, Order, User } = require("../models");
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

router.post("/apply", isLoggedIn, async (req, res, next) => {
  try {
    const checkUserId = await Host.findOne({
      where: {
        UserId: req.user.id,
      },
    });
    if (checkUserId) {
      return res
        .status(403)
        .json("이미 신청하신 내용을 심사중입니다. 조금만 기다려주세요.");
    }
    const checkHostName = await Host.findOne({
      where: {
        host_name: req.body.host_name,
      },
    });
    if (checkHostName) {
      return res.status(403).json("이미 사용중인 상호명입니다.");
    }
    const checkHostPhone = await Host.findOne({
      where: {
        host_phone: req.body.host_phone,
      },
    });
    if (checkHostPhone) {
      return res.status(403).json("이미 사용중인 연락처입니다.");
    }
    const host = await Host.create({
      host_name: req.body.host_name,
      host_phone: req.body.host_phone,
      business_type: req.body.business_type,
      about: req.body.about,
      contract: req.body.contract,
      personal_information: req.body.personal_information,
      UserId: req.user.id,
    });
    return res.status(201).json(host);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/account", isLoggedIn, async (req, res, next) => {
  try {
    const host = await Host.findOne({
      where: { UserId: req.user.id },
      attributes: {
        exclude: ["password"],
      },
    });
    if (!host) {
      return res.status(404).send("존재하지 않는 호스트입니다.");
    }
    const appliedHost = await Host.findOne({
      where: { UserId: req.user.id },
      attributes: {
        exclude: ["password"],
      },
    });
    res.status(200).json(appliedHost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put("/apply", isLoggedIn, async (req, res, next) => {
  try {
    const checkHost = await Host.findOne({
      where: { UserId: req.user.id },
    });
    if (!checkHost) {
      return res.status(403).json("수정 권한이 없습니다.");
    }
    const updateHost = await Host.update(
      {
        id: req.params.id,
        host_name: req.body.host_name,
        host_phone: req.body.host_phone,
        about: req.body.about,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );
    res.status(201).json({ updateHost });
    console.log(res);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/tours", isLoggedIn, async (req, res, next) => {
  try {
    const myTours = await Tour.findAll({
      where: { UserId: req.user.id },
      attributes: {
        exclude: ["password"],
      },
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
    res.status(201).json(myTours);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/tours/create", isLoggedIn, async (req, res, next) => {
  try {
    const checkTourName = await Tour.findOne({
      where: {
        title: req.body.title,
      },
    });
    if (checkTourName) {
      return res.status(403).json("이미 사용중인 여행 상품명입니다.");
    }
    const createTour = await Tour.create({
      title: req.body.title,
      about: req.body.about,
      image: req.body.image,
      option: req.body.option,
      closedDays: req.body.closedDays,
      price: req.body.price,
      refund_type: req.body.refund_type,
      UserId: req.user.id,
    });
    res.status(201).json({ createTour });
    console.log(res);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put("/tour/:tourId", isLoggedIn, async (req, res, next) => {
  try {
    const checkHost = await Tour.findOne({
      where: {
        UserId: req.user.id,
      },
    });
    if (!checkHost) {
      return res.status(403).json("해당 상품의 수정 권한이 없습니다.");
    }
    const updateTour = await Tour.update(
      {
        id: req.params.id,
        title: req.body.title,
        about: req.body.about,
        option: req.body.option,
        closedDays: req.body.closedDays,
        price: req.body.price,
        refund_type: req.body.refund_type,
      },
      {
        where: {
          id: req.body.id,
        },
      }
    );
    res.status(201).json({ updateTour });
    console.log(res);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/tour/:tourId", isLoggedIn, async (req, res, next) => {
  // DELETE /post/10
  try {
    await Tour.destroy({
      where: {
        id: req.params.tourId,
        UserId: req.user.id,
      },
    });
    res.status(200).json({ TourId: parseInt(req.params.tourId) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/sales", isLoggedIn, async (req, res, next) => {
  try {
    const totalSales = await Order.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Tour,
          attributes: ["title", "price"],
        },
        {
          model: User,
          attributes: ["username", "email"],
        },
      ],
    });
    res.status(201).json(totalSales);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post(
  "/profile",
  isLoggedIn,
  upload.single("host_image"),
  async (req, res) => {
    // 호스트 이미지 업로드
    console.log(req.user);
    try {
      const checkHost = await Host.findOne({
        where: {
          UserId: req.user.id,
        },
        attributes: {
          exclude: ["password"],
        },
      });
      if (!checkHost) {
        return res.status(403).json("본인의 계정이 아닙니다.");
      }
      console.log(req.file);
      const hostImg = await Host.update(
        {
          host_image: `/img/${req.file.filename}`,
        },
        {
          where: {
            UserId: req.user.id,
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

module.exports = router;
