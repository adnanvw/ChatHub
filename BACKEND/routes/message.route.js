const express = require("express");
//update

const { auth } = require("../middlewares/auth.middleware");
const { MessageModel } = require("../models/message.model");
const { UserModel } = require("../models/user.model");
const { ChatModel } = require("../models/chat.model");
const messageRoute = express.Router();
messageRoute.post("/", auth, async (req, res) => {
  const { content, chatId } = req.body;
  var newMessage = {
    sender: req.user,
    content,
    chat: chatId,
  };
  try {
    var message = await MessageModel.create(newMessage);
    message = await message.populate("sender", "name profilePicture");
    message = await message.populate("chat");
    message = await UserModel.populate(message, {
      path: "chat.user",
      select: "name profilePicture email",
    });
    await ChatModel.findByIdAndUpdate(req.body.chatId, {
      message,
    });
    res.json(message);
  } catch (error) {
    res.json({ error: error.message });
  }
});
messageRoute.get("/:chatId", auth, async (req, res) => {
  try {
    var msg = await MessageModel.find({ chat: req.params.chatId })
      .populate("sender", "name profilePicture email")
      .populate("chat");
    res.json(msg);
  } catch (error) {
    res.json({ error: error.message });
  }
});
module.exports = { messageRoute };
