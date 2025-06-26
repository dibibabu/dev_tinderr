const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: user,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    res.json({
      message: "data fetched successfully",
      data: connectionRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

module.exports = userRouter;
