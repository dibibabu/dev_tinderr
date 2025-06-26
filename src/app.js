const express = require("express");

const connectDB = require("./config/database");

const app = express();

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter=require("./routes/user")

const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

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
