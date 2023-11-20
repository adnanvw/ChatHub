const mongoose = require("mongoose");
//update
require("dotenv").config();
const connection = mongoose.connect(process.env.url);
module.exports = {
  connection,
};
