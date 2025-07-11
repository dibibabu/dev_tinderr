const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const connectionRequest = require("../models/connectionRequest");

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

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const data = await ConnectionRequest.find({
      $or: [
        {
          toUserId: user._id,
          status: "accepted",
        },
        {
          fromUserId: user._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", "firstName lasteName")
      .populate("toUserId", "firstName lasteName");

   
    const finalData = data.map((row) => {
      if (row.fromUserId._id.toString() === user._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.json({ data: finalData });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = userRouter;
