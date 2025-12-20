const mongoose = require("mongoose");
mongoose.pluralize(null); //关闭自动复数化
const { Schema, model } = mongoose;
const { host } = require("@/config/default").dbUrl;
mongoose
  .connect(host)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
module.exports = {
  Schema,
  model,
  mongoose,
};
