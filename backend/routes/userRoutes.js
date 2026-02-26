const express = require("express");
const router = express.Router();
const {
  createUser,
  getUserSettings,
  updateUserSettings,
} = require("../controllers/UserController");
const verifyToken = require("../middleware/verifyToken");

// Public — called right after Firebase signup/login
router.post("/", createUser);

// Protected — requires valid Firebase token
router.get("/:firebaseUID/settings", verifyToken, getUserSettings);
router.put("/:firebaseUID/settings", verifyToken, updateUserSettings);

module.exports = router;