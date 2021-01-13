const express = require("express");
const router = express.Router();
const { Comment } = require("../models");

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

router.post("/:tourId/:commentId/comment", async (req, res, next) => {
  try {
    const comment = await Comment.create({
      content: req.body.content,
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/", (req, res, next) => {
  res.send("respond with a resource from comment");
});

module.exports = router;
