const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: user,
      status: "interested",
    }).populate("fromUserId", "firstName lastName photoUrl age gender about");
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
      .populate("fromUserId", "firstName lastName photoUrl age gender about")
      .populate("toUserId", "firstName lastName photoUrl age gender about");

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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
  const user = req.user;

  const connectionRequests= await connectionRequest.find({
    $or:
    [
      {fromUserId:user._id},
      {toUserId:user._id}]
  }).select("fromUserId toUserId")
console.log(connectionRequests);

  const hideRequests= new Set()

  connectionRequests.forEach((req)=>{
    hideRequests.add(req.fromUserId.toString())
    hideRequests.add(req.toUserId.toString())
  })
const users =await User.find({
  $and: [
    { _id: { $nin: Array.from(hideRequests) } },
    { _id: { $ne: user._id } }
  ]
}).select("firstName lastName photoUrl age gender about");


  res.json({
      message: "feed fetched successfully",
      data: users,
    });

  


  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = userRouter;
