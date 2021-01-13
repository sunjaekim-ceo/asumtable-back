const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");
const logger = require("morgan");
const path = require("path");
const connectRedis = require("connect-redis");
const RedisStore = connectRedis(session);
// const favicon = require("serve-favicon");
// const bodyPaser = require("body-parser");
// const redis = require("./redis");
const hpp = require("hpp");
const helmet = require("helmet");

var indexRouter = require("./routes/index");
var authRouter = require("./routes/auths");
var userRouter = require("./routes/users");
var hostRouter = require("./routes/hosts");
var adminRouter = require("./routes/users");
var tourRouter = require("./routes/tours");
var favoriteRouter = require("./routes/favorites");
var orderRouter = require("./routes/orders");
var imageRouter = require("./routes/images");
var testRouter = require("./routes/imageTest");

const db = require("./models/index");
const passportConfig = require("./passport");

dotenv.config();
const app = express();
db.sequelize
  .sync({ force: false })
  .then(() => {
    console.log("ASUM_DB Sequelize Sync Success");
  })
  .catch(console.error);
passportConfig();

// const authController = require("./api/auths/authTokenController");

// var orderRouter = require("./routes/orders");
// var indexRouter = require("./routes/index");
// var authRouter = require("./api/auths/auth.router");
// var userRouter = require("./api/users/user.router");
// var hostRouter = require("./api/hosts/host.router");
// var adminRouter = require("./api/admin/admin.router");
// var tourRouter = require("./api/tours/tour.router");
// var orderRouter = require("./api/orders/order.router");

// app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(hpp());
app.use(helmet({ contentSecurityPolicy: false }));
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  proxy: true,
  name: "sessionID",
  cookie: {
    httpOnly: true,
    secure: false,
  },
  store: new RedisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    pass: process.env.REDIS_PASSWORD,
    logErrors: true,
  }),
};

app.use("/", express.static(path.join(__dirname, "/uploads")));
app.use(express.json({ limit: "20mb" }));
app.use(
  express.urlencoded({
    limit: "20mb",
    extended: false,
  })
);
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session(sessionOption));
app.use(logger("dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("img"));

app.get("/", (req, res) => {
  res.send("hello express");
});

app.use("/api", indexRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/host", hostRouter);
app.use("/api/admin", adminRouter);
app.use("/api/tours", tourRouter);
app.use("/api/favorites", favoriteRouter);
app.use("/api/orders", orderRouter);
app.use("/api/images", imageRouter);
app.use("/api/test", testRouter);
// app.use("/api/order", orderRouter);

app.listen(80, () => {
  console.log("서버 실행 중");
});

module.exports = app;
