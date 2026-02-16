const express = require("express");
const router = express.Router();

const {
  createPortfolio,
  addStock,
  getPortfolio
} = require("../controllers/portfolioController");

router.post("/", createPortfolio);
router.post("/add-stock", addStock);
router.get("/:userId", getPortfolio);

module.exports = router;
