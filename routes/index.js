var express = require("express");
var router = express.Router();
const { Host, Tour, Review, Image, User, Tag, TourTag } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("../middleware/loginState");

/* GET users listing. */
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

router.get("/", async (req, res, next) => {
  try {
    const list = await Tour.findAll({
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: Review,
          attributes: ["rating"],
        },
        {
          model: Image,
          attributes: ["url"],
        },
      ],
    });
    res.status(201).json(list);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// router.get("/", isLoggedIn, async (req, res, next) => {
//   try {
//     const listForNotLoggedIn = await Tour.findAll({
//       limit: 5,
//       order: [["createdAt", "DESC"]],
//       include: [
//         {
//           model: Host,
//           attributes: ["id"],
//         },
//         {
//           model: Image,
//           attributes: ["url"],
//         },
//       ],
//     });
//     res.status(201).json(listForLoggedIn);
//     res.send("id: " + req.query.id);
//     if (isNotLoggedIn) {
//       res.status(201).json(listForNotLoggedIn);
//       res.send("id: " + req.query.id);
//     } else {
//       const listForLoggedIn = await Tour.findAll({
//         limit: 5,
//         order: [["createdAt", "ASC"]],
//         include: [
//           {
//             model: Host,
//             attributes: ["id"],
//           },
//           {
//             model: Image,
//             attributes: ["url"],
//           },
//         ],
//       });
//       res.status(201).json(listForLoggedIn);
//       res.send("id: " + req.query.id);
//     }
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

// router.post("/", (req, res, next) => {
//   res.send("Welcome to POST ASUM Express");
// });

module.exports = router;
