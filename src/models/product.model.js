const Product = require("../models/product.model");
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  code: { type: String, required: true, unique: true },
  price: Number,
  status: { type: Boolean, default: true },
  stock: Number,
  category: String,
  thumbnails: [String]
});

module.exports = mongoose.model("Product", productSchema);
