const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  customId: { type: Number, unique: true, required: true },
  name: String,
  email: String,
  userName: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
