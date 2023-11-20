const express = require("express");
const app = express();
const { connection } = require("./db");
const { userRouter } = require("./routes/user.route");
const cors = require("cors");
const { chatRouter } = require("./routes/chat.route");
const { messageRoute } = require("./routes/message.route");
const { fileRouter } = require("./routes/file.route");
app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRoute);
app.use("/file", fileRouter);
app.listen(5000, async () => {
  try {
    await connection;
  } catch (error) {
    console.log(error);
  }
});