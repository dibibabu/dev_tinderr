const express = require("express");

const connectDB = require("./config/database");
const cors = require('cors')

const path = require("path");

const app = express();

// TEMP DEBUG: remove once the duplicate-call question is settled
let reqCount = 0;
app.use((req, res, next) => {
  console.log(++reqCount, req.method, req.originalUrl);
  next();
});
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter=require("./routes/user")

const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

// uploaded profile images are served from /uploads
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

connectDB()
  .then(() => {
    console.log("database connected successfully");
    app.listen(7777, () => {
      console.log("app is listening to port 7777");
    });
  })
  .catch(() => {
    console.log("database connection error");
  });
