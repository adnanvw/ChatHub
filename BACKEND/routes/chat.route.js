const express = require("express");
//update
const app = express();
const chatRouter = express.Router();
const { auth } = require("../middlewares/auth.middleware");
const { ChatModel } = require("../models/chat.model");
const { UserModel } = require("../models/user.model");
chatRouter.post("/", auth, async (req, res) => {
  try {
    const { userID } = req.body;
    var isChat = await ChatModel.find({
      isGroupChat: false,
      $and: [
        {
          user: { $elemMatch: { $eq: req.user } },
        },
        {
          user: { $elemMatch: { $eq: userID } },
        },
      ],
    })
      .populate("user")
      .populate("message");
    isChat = await UserModel.populate(isChat, {
      path: "message.sender",
      select: "name profilePicture email",
    });
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        user: [req.user, userID],
      };
      try {
        const createdChat = await ChatModel.create(chatData);
        const FullChat = await ChatModel.findOne({
          _id: createdChat._id,
        }).populate("user");
        res.json(FullChat);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});
chatRouter.get("/", auth, async (req, res) => {
  try {
    ChatModel.find({
      $or: [
        {
          user: { $eq: req.user },
        },
        {
          admin: { $eq: req.user },
        },
      ],
    })
      .populate("user")
      .populate("admin")
      .populate("message")
      .sort({ updateAt: -1 })
      .then(async (result) => {
        result = await UserModel.populate(result, {
          path: "message.sender",
          select: "name email",
        });
        res.send(result);
      });
  } catch (error) {
    console.log(error);
  }
});
chatRouter.post("/groupChat", auth, async (req, res) => {
  if (!req.body.user || !req.body.name) {
    return res.send({ message: "Please Fill all the fields", GC: false });
  }
  var users = JSON.parse(req.body.user);
  if (users.length < 2) {
    return res.send({
      message: "Group chat required minimum 2 users",
      GC: false,
    });
  }
  users.push(req.user);
  try {
    const groupChat = await ChatModel.create({
      chatName: req.body.name,
      user: users,
      isGroupChat: true,
      admin: req.user,
    });
    const fullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
      .populate("user", "-password")
      .populate("admin", "-password");
    res.json({ message: "Group chat created", GC: true, fullGroupChat });
  } catch (error) {
    res.json({ error: error.message });
  }
});
chatRouter.put("/groupChatRename", auth, async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await ChatModel.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("user", "-password")
    .populate("admin", "-password");
  if (!updatedChat) {
    res.json({ message: "Chat Not Found" });
  } else {
    res.json({ updatedChat, message: "Group name changed successfully" });
  }
});
chatRouter.put("/groupChatRemove", auth, async (req, res) => {
  const { chatId, userId } = req.body;
  const updatedChat = await ChatModel.findByIdAndUpdate(
    chatId,
    {
      $pull: { user: userId },
    },
    {
      new: true,
    }
  )
    .populate("user", "-password")
    .populate("admin", "-password");

  if (!updatedChat) {
    res.json({ message: "Chat Not Found" });
  } else {
    res.json({ updatedChat, message: "has been removed" });
  }
});
chatRouter.put("/groupChatAdd", auth, async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await ChatModel.findByIdAndUpdate(
    chatId,
    {
      $push: { user: userId },
    },
    {
      new: true,
    }
  )
    .populate("user", "-password")
    .populate("admin", "-password");

  if (!added) {
    res.status(404);
    res.json({ message: "Chat Not Found" });
  } else {
    res.json({added});
  }
});
chatRouter.delete("/groupChat/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedChat = await ChatModel.findByIdAndDelete(id)
      .populate("user", "-password")
      .populate("admin", "-password")
      .populate("message");
      
    if (!deletedChat) {
      res.json({ message: "Chat Not Found" });
    } else {
      res.json({ message: "Group chat deleted successfully",deletedChat});
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = {
  chatRouter,
};
