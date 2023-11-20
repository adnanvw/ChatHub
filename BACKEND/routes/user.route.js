const express = require("express");
//update

const userRouter = express.Router();
const { UserModel } = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth } = require("../middlewares/auth.middleware");
userRouter.get("/welcome", async (req, res) => {
  try {
    res.send("Welcome User");
  } catch (error) {
    res.status(404).send(error.message);
  }
});
userRouter.get("/", auth, async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : null;
    const user = await UserModel.find(keyword).find({
      _id: { $ne: req.user },
    });
    res.send(user);
  } catch (err) {
    console.error(err);
    res.json({ error: "Failed to fetch user" });
  }
});
userRouter.post("/register", async (req, res) => {
  const { name, email, password, profilePicture } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.json({
        message: "User already exists, please login",
        auth: false,
      });
    }
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.json({ err });
      } else {
        const user = new UserModel({
          name,
          email,
          password: hash,
          profilePicture,
        });
        await user.save();
        res.json({
          message: "User has been Registered successfully",
          auth: true,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ message: "Email not found", auth: false });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.json({ message: "Incorrect Password", auth: false });
    }
    const token = jwt.sign({ userId: user._id, user: user.name }, "ChatHub", {
      expiresIn: "7d",
    });
    res.json({ message: "Login successful", token, user, auth: true });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = {
  userRouter,
};
