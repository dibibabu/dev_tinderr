const express = require("express");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");


requestRouter.post("/send/:status/:toUserId",userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id,
    
    
      toUserId = req.params.toUserId,
      status = req.params.status;
console.log(fromUserId);
    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data =await connectionRequest.save()
    res.json({

      message:"Connection request send successfully",
      data
    })
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = requestRouter;
