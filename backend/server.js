require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const marketRoutes = require("./routes/marketRoutes");




const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/market", marketRoutes);
// Test route
app.get("/", (req, res) => {
  res.send("Stock Monitor API is running...");
});

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use("/api/users", userRoutes);
app.use("/api/portfolio", portfolioRoutes);
