const express = require("express");
const router = express.Router();
const { Tour, Image, Host, User, Order, Tag } = require("../models");
const { isLoggedIn } = require("../middleware/loginState");

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

router.post("/new", isLoggedIn, async (req, res, next) => {
  try {
    const newOrder = await Order.create({
      qty: req.body.qty,
      tour_date: req.body.tour_date,
      option: req.body.option,
      total_price: req.body.total_price,
      terms: req.body.terms,
      UserID: req.body.UserId,
      TourId: req.body.TourId,
    });
    res.status(201).json({ newOrder });
    console.log(res);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//태그 삽입 api
router.post(
  "/tags",
  // isNotLoggedIn,
  async (req, res, next) => {
    try {
      const addTag = await Tag.create({
        title: req.body.title,
      });
      res.status(201).send(addTag);
    } catch (error) {
      console.error(error);
      next(error); //status 500
    }
  }
);

module.exports = router;
