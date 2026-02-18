const express = require("express");
const router = express.Router();

const { searchStock, getHistoricalData } = require("../controllers/marketController");

router.get("/search", searchStock);
router.get("/history", getHistoricalData);

module.exports = router;
 
