const express = require("express");
const router = express.Router();

const {
  createPortfolio,
  addStock,
  getPortfolio,
  updateStock,
  removeStock
} = require("../controllers/portfolioController");

// Create portfolio (if not exists)
router.post("/", createPortfolio);

// Add stock
router.post("/add-stock", addStock);

// 🔥 Updated to use firebaseUID
router.get("/:firebaseUID", getPortfolio);

// Update stock
router.put("/update-stock", updateStock);

// Remove stock
router.delete("/remove-stock", removeStock);

module.exports = router;