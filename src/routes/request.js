const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id,
      toUserId = req.params.toUserId,
      status = req.params.status;

    const allowedStatuses = ["ignored", "interested"];

    if (!allowedStatuses.includes(status)) {
      return res.status(488).json({ message: "Invalid status" });
    }

    const reqUserExist=await User.findById(toUserId)

    if (!reqUserExist) {
     return res.status(404).json({message:"requested User Not Found"})
    }
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingConnectionRequest) {
      return res
        .status(488)
        .json({ message: "Connection Request already exist" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    res.json({
      message: "Connection request send successfully",
      data,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = requestRouter;
