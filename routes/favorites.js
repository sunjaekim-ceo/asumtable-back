const express = require("express");
const router = express.Router();
const { Tour, User, Review, Image } = require("../models");
const { isLoggedIn } = require("../middleware/loginState");
const user = require("../models/user");

router.patch("/", isLoggedIn, async (req, res, next) => {
  try {
    console.log(req.body.tourId);
    const tour = await Tour.findOne({
      where: {
        id: req.body.tourId,
      },
    });
    if (!tour) {
      return res.status(403).send("해당 여행상품이 존재하지 않습니다.");
    }
    await tour.addLovers(req.user.id);
    res.json({ success: true, TourId: tour.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/read", isLoggedIn, async (req, res, next) => {
  try {
    // console.log(req.body.tourId);
    // const tour = await Tour.findOne({
    //   where: {
    //     id: req.body.tourId,
    //   },
    // });
    const tour = await Tour.findOne({
      where: {
        id: req.body.tourId,
      },
      include: [
        {
          model: User,
          as: "Lovers",
          // attributes: ["UserId"],
        },
      ],
    });
    if (!tour) {
      return res.status(403).send("해당 여행상품이 존재하지 않습니다.");
    }
    const favorited = await tour.getLovers();
    let result = false;
    if (favorited.length !== 0) {
      result = true;
    }
    console.log("tour : ", tour);
    console.log("favorited.length : ", favorited.length);
    console.log("favorited 값 : ", favorited);
    console.log("Result : ", result);
    res.status(200).json({ success: true, favorited: result });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/remove", isLoggedIn, async (req, res, next) => {
  try {
    console.log(req.body.tourId);
    const tour = await Tour.findOne({ where: { id: req.body.tourId } });
    if (!tour) {
      return res.status(403).send("해당 여행상품이 존재하지 않습니다.");
    }
    await tour.removeLovers(req.user.id);
    res.json({ success: true, TourId: tour.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/list", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
    });
    const lovedList = await user.getLoved({
      where: { UserId: req.user.id },
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
    console.log(lovedList);
    res.status(200).json(lovedList);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
