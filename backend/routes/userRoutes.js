const express = require("express");
const router = express.Router();

const { createUser } = require("../controllers/UserController");

// POST /api/users
router.post("/", createUser);

module.exports = router;
