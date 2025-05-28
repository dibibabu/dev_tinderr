const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "accepted", "ignored", "rejected"],
        message: "{value} is incorrect",
      },
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("connectionRequest", connectionRequestSchema);
