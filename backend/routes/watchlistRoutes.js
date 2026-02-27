const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require("../controllers/watchlistController");

router.use(verifyToken);
router.get("/:firebaseUID", getWatchlist);
router.post("/add", addToWatchlist);
router.delete("/remove", removeFromWatchlist);

module.exports = router;