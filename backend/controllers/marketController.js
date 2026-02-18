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

exports.getHistoricalData = asyncHandler(async (req, res) => {
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
        function: "TIME_SERIES_DAILY",
        symbol,
        apikey: API_KEY
      }
    }
  );

  const timeSeries = response.data["Time Series (Daily)"];

  if (!timeSeries) {
    const error = new Error("No historical data found");
    error.statusCode = 404;
    throw error;
  }

  const formattedData = Object.entries(timeSeries)
    .slice(0, 30)
    .map(([date, values]) => ({
      date,
      close: parseFloat(values["4. close"])
    }))
    .reverse();

  res.status(200).json({
    success: true,
    data: formattedData
  });
});

// this funtion is used to get the current stock price for a given symbol. It calls the Alpha Vantage API to retrieve the current price and returns it in the response. If there is an error during the API call, it catches the error and returns a 500 status code with a "Server error" message.
