const axios = require("axios");
const asyncHandler = require("../middleware/asyncHandler");

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

exports.searchStock = asyncHandler(async (req, res) => {
  const { symbol } = req.query;

  if (!symbol) {
    const error = new Error("Symbol is required");
    error.statusCode = 400;
    throw error;
  }

  const response = await axios.get(
    "https://www.alphavantage.co/query",
    {
      params: {
        function: "GLOBAL_QUOTE",
        symbol,
        apikey: API_KEY
      }
    }
  );

  res.status(200).json({
    success: true,
    data: response.data
  });
});

