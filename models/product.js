const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  customId: { type: Number, unique: true, required: true },
  name: String,
  description: String,
  price: { type: Number, required: true },
  available: { type: Boolean, default: true },
});

const Product = mongoose.model("product", productSchema);

module.exports = Product;
