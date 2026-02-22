const mongoose = require("mongoose");

// ===========================================
// 📦 Stock Schema (Supports Custom Assets)
// ===========================================
const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 0
  },

  buyPrice: {
    type: Number,
    required: true,
    min: 0
  },

  // ✅ Optional estimated sell price (for manual/custom assets)
  estSellPrice: {
    type: Number,
    default: null,
    min: 0
  },

  // ✅ Flag to identify manually added assets
  isCustom: {
    type: Boolean,
    default: false
  }

}, { _id: false });


// ===========================================
// 📊 Portfolio Schema
// ===========================================
const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  stocks: [stockSchema]

}, { timestamps: true });


module.exports = mongoose.model("Portfolio", portfolioSchema);