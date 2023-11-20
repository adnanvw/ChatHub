const mongoose = require("mongoose");
//update

const chat = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserModel" }],
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MessageModel",
    },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
  },
  {
    timestamps: true,
  }
);
const ChatModel = mongoose.model("ChatModel", chat);
module.exports = { ChatModel };
