const express = require("express");
const router = express.Router();
const { searchStock } = require("../controllers/marketController");

router.get("/search", searchStock);

module.exports = router;
