// ==============================
// 📦 Load Environment Variables
// ==============================
require("dotenv").config();

const express = require("express");
const cors = require("cors");

// ==============================
// 📦 Import DB Connection
// ==============================
const connectDB = require("./config/db");

// ==============================
// 📦 Import Routes
// ==============================
const userRoutes = require("./routes/userRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const marketRoutes = require("./routes/marketRoutes");

// ==============================
// 📦 Import Middleware
// ==============================
const errorHandler = require("./middleware/errorHandler");

// ==============================
// 🚀 Initialize App
// ==============================
const app = express();

// ==============================
// 🔌 Connect Database FIRST
// ==============================
connectDB();

// ==============================
// 🔧 Middleware
// ==============================
app.use(cors());
app.use(express.json());

// ==============================
// 🛣️ Routes
// ==============================
app.get("/", (req, res) => {
  res.send("Stock Monitor API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/market", marketRoutes);

// ==============================
// ❗ Global Error Handler (LAST)
// ==============================
app.use(errorHandler);

// ==============================
// 🟢 Start Server
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});