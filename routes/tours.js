const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const {
  Tour,
  Image,
  Host,
  User,
  Review,
  Comment,
  Favorite,
} = require("../models");
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
    destination(req, files, cb) {
      cb(null, "img/");
    },
    filename(req, files, cb) {
      const ext = path.extname(files.originalname); //확장자 추출
      const basename = path.basename(files.originalname, ext); //파일명
      cb(null, basename + "_" + new Date().getTime() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// //이미지 저장 위치 맴핑
// router.post("/images", isLoggedIn, upload.array("images"), (req, res, next) => {
//   console.log(req.files);
//   res.json(req.files.map((v) => v.location));
// });

// 여행상품 생성
router.post("/create", isLoggedIn, async (req, res, next) => {
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
      option: req.body.option,
      closedDays: req.body.closedDays,
      price: req.body.price,
      refund_type: req.body.refund_type,
      UserId: req.user.id,
    });
    res.status(201).json({ createTour, tourImg });
    console.log(res);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post(
  "/create/images",
  isLoggedIn,
  upload.single("images"),
  async (req, res) => {
    console.log(req.files);
    try {
      const checkTourId = await Tour.findOne({
        where: {
          UserId: req.user.id,
        },
        order: [["createdAt", "DESC"]],
        limit: 1,
      });
      const tourImg = await Image.create({
        src: `${req.file.filename}`,
        TourId: checkTourId.id,
      });
      // const tourImg = await Promise.all(
      //   req.files.map((v) =>
      //     Image.create({
      //       src: v.filename,
      //       TourId: req.checkTourId.id,
      //     })
      //   )
      // );
      return res.status(201).json(tourImg);
      // const tourImg = await Image.create({
      //   src: `${req.file.filename}`,
      //   // TourId: req.tour.id,
      // });
      // return res.json({
      //   success: true,
      //   filePath: res.req.file.path,
      //   fileName: res.req.file.filename,
      // });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
);

// router.post(
//   "/create/images",
//   isLoggedIn,
//   upload.array("src", 10),
//   async (req, res, next) => {
//     try {
//       const tourImg = await Promise.all(
//         req.files.map((v) =>
//           Image.create({
//             src: v.filename,
//             TourId: req.tour.id,
//           })
//         )
//       );`
//       res.status(201).json({ tourImg });
//       console.log(res);
//     } catch (error) {
//       console.error(error);
//       next(error);
//     }
//   }
// );

//사용자 투어 상품 상세 페이지
router.get("/:tourId", async (req, res, next) => {
  try {
    const tour = await Tour.findOne({
      where: { id: req.params.tourId },
    });
    if (!tour) {
      return res.status(404).send("존재하지 않는 게시글입니다.");
    }
    const fullTour = await Tour.findOne({
      where: { id: req.params.tourId },
      include: [
        {
          model: Image,
          attribute: ["id", "src", "TourId"],
        },
        {
          model: User,
          attributes: ["id", "email"],
          include: [
            {
              model: Host,
              attributes: ["id"],
            },
          ],
        },
      ],
    });
    res.status(200).json(fullTour);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 사용자 리뷰 작성 API
router.post("/tourId/review", isLoggedIn, async (req, res, next) => {
  try {
    const checkTour = await Tour.findOne({
      where: {
        id: req.params.tourId,
      },
    });
    if (!checkTour) {
      return res.status(403).json("존재하지 않는 여행 상품입니다.");
    }
    const writeReview = await Tour.create({
      comment: req.body.comment,
      rating: req.body.rating,
      UserId: req.user.id,
      TourId: req.params.tourId,
      price: req.body.price,
    });
    res.status(201).json({ writeReview });
    console.log(res);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// router.get(
//   "/:tourId",
//   // isLoggedIn,
//   async (req, res, next) => {
//     try {
//       const tourId = await Tour.findAll({
//         id: req.body.id,
//         title: req.body.title,
//         about: req.body.about,
//         image: req.body.image,
//         option: req.body.option,
//         closedDays: req.body.closedDays,
//         price: req.body.price,
//         refund_type: req.body.refund_type,
//         UserId: req.body.UserId,
//         include: [
//           {
//             model: Review,
//             attributes: ["rating"],
//           },
//           {
//             model: Image,
//             attributes: ["url"],
//           },
//         ],
//       });
//       res.status(201).json({ tourId });
//       console.log(res);
//     } catch (error) {
//       console.error(error);
//       next(error);
//     }
//   }
// );

// router.get("/:tourId", async (req, res, next) => {
//   // GET /post/1
//   try {
//     const tour = await Post.findOne({
//       where: { id: req.params.tourId },
//     });
//     if (!tour) {
//       return res.status(404).send("존재하지 않는 게시글입니다.");
//     }
//     const fullTour = await Post.findOne({
//       where: { id: post.id },
//       include: [
//         {
//           model: Tour,
//           include: [
//             {
//               model: Host,
//               attributes: ["id", "host_name"],
//             },
//             {
//               model: Image,
//             },
//           ],
//         },
//         {
//           model: Image,
//         },
//       ],
//     });
//     res.status(200).json(fullTour);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

// router.get("/images/:id", express.static("/uploads"));

router.post(
  "/images/",
  isLoggedIn,
  upload.array("images"),
  async (req, res) => {
    try {
      const checkTour = await Tour.findOne({
        where: {
          id: req.params.tourId,
        },
      });
      if (!checkTour) {
        return res.status(403).json("존재하지 않는 여행 상품입니다.");
      }
      console.log(req.file);
      const tourImg = await Image.create(
        {
          src: `${req.file.filename}`,
          TourId: req.params.tourId,
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

// router.get("/:id", isLoggedIn, async (req, res, next) => {
//   try {
//     if (req.user) {
//       const fullAuthWithoutPassword = await User.findOne({
//         where: { id: req.user.id },
//         attributes: {
//           exclude: ["password"],
//         },
//         include: [
//           {
//             model: Tour,
//             attributes: ["id", "title", "about", "price"],
//           },
//         ],
//       });
//       res.status(200).json(fullAuthWithoutPassword);
//     } else {
//       res.status(200).json(null);
//     }
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

// router.get("/tour/:id", isLoggedIn, async (req, res, next) => {
//   try {
//     const showTour = await Tour.findAll({
//       where: {
//         id: `${id}`,
//         include: [
//           {
//             model: Review,
//             attributes: ["comment", "rating"],
//           },
//           {
//             model: Image,
//             attributes: ["url"],
//           },
//         ],
//       },
//     });
//     res.status(201).json(showTour);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

// router.post("/create", isLoggedIn, upload.none(), async (req, res, next) => {
//   // POST /post
//   try {
//     const checkTourName = await Tour.findOne({
//       where: {
//         title: req.body.title,
//       },
//     });
//     if (checkTourName) {
//       return res.status(403).json("이미 사용중인 여행 상품명입니다.");
//     }
//     const post = await Post.create({
//       title: req.body.title,
//       about: req.body.about,
//       option: req.body.option,
//       closedDays: req.body.closedDays,
//       price: req.body.price,
//       refund_type: req.body.refund_type,
//       UserId: req.user.id,
//     });
//     if (req.body.image) {
//       if (Array.isArray(req.body.image)) {
//         // 이미지를 여러 개 올리면 image: [제로초.png, 부기초.png]
//         const images = await Promise.all(
//           req.body.image.map((image) => Image.create({ src: image }))
//         );
//         await post.addImages(images);
//       } else {
//         // 이미지를 하나만 올리면 image: 제로초.png
//         const image = await Image.create({ src: req.body.image });
//         await post.addImages(image);
//       }
//     }
//     const fullTour = await Tour.findOne({
//       where: { id: tour.id },
//       include: [
//         {
//           model: Image,
//         },
//         {
//           model: User, // 게시글 작성자
//           attributes: ["id"],
//         },
//       ],
//     });
//     res.status(201).json(fullTour);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

module.exports = router;

//AWS-S3 설정
// AWS.config.update({
//   accessKeyId: process.env.S3_ACCESS_KEY_ID,
//   secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//   region: "ap-northeast-2",
// });

//MULTER-S3 설정
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

// router.get("/", isLoggedIn, async (req, res, next) => {
//   try {
//     if (req.user) {
//       const fullState = await User.findOne({
//         where: { id: req.user.id },
//         attributes: {
//           exclude: ["password"],
//         },
//       });
//       res.status(200).json(fullState);
//     } else {
//       res.status(200).json(null);
//     }
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });

//array는 이미지 여러장, single은 이미지 한장
