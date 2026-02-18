const express = require("express");
const router = express.Router();

const {
  createPortfolio,
  addStock,
  getPortfolio,
  updateStock,
  removeStock
} = require("../controllers/portfolioController");


router.post("/", createPortfolio);
router.post("/add-stock", addStock);
router.get("/:userId", getPortfolio);
router.put("/update-stock", updateStock);
router.delete("/remove-stock", removeStock);


module.exports = router;
