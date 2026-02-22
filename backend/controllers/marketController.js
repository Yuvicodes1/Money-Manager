const axios = require("axios");
const asyncHandler = require("../middleware/asyncHandler");
const { getFromCache, setCache } = require("../utils/cache");

const API_KEY = process.env.FINNHUB_API_KEY;



// ======================================================
// 🔎 SEARCH STOCK (Finnhub)
// ======================================================
exports.searchStock = asyncHandler(async (req, res) => {
  const { symbol } = req.query;

  if (!symbol) {
    const error = new Error("Symbol is required");
    error.statusCode = 400;
    throw error;
  }

  const response = await axios.get(
    "https://finnhub.io/api/v1/search",
    {
      params: {
        q: symbol,
        token: API_KEY
      }
    }
  );

  /*
    Finnhub search response example:
    {
      result: [
        {
          description: "APPLE INC",
          displaySymbol: "AAPL",
          symbol: "AAPL",
          type: "Common Stock"
        }
      ]
    }
  */

  res.status(200).json({
    success: true,
    data: response.data.result
  });
});



// ======================================================
// 📈 GET HISTORICAL DATA (Finnhub Candle API)
// ======================================================
exports.getHistoricalData = asyncHandler(async (req, res) => {
  const { symbol } = req.query;

  if (!symbol) {
    const error = new Error("Symbol is required");
    error.statusCode = 400;
    throw error;
  }

  // ✅ Check cache first
  const cached = getFromCache(`history_${symbol}`);
  if (cached) {
    console.log("History cache hit:", symbol);
    return res.status(200).json({
      success: true,
      data: cached
    });
  }

  const now = Math.floor(Date.now() / 1000);
  const oneMonthAgo = now - 60 * 60 * 24 * 30;

  const response = await axios.get(
    "https://finnhub.io/api/v1/stock/candle",
    {
      params: {
        symbol,
        resolution: "D",
        from: oneMonthAgo,
        to: now,
        token: API_KEY
      }
    }
  );

  /*
    Finnhub candle response:
    {
      c: [close prices],
      t: [timestamps],
      s: "ok"
    }
  */

  if (response.data.s !== "ok") {
    console.log("No historical data found:", response.data);

    return res.status(200).json({
      success: true,
      data: []
    });
  }

  const formattedData = response.data.t.map((timestamp, index) => ({
    date: new Date(timestamp * 1000).toISOString().split("T")[0],
    close: response.data.c[index]
  }));

  // ✅ Save to cache
  setCache(`history_${symbol}`, formattedData);

  res.status(200).json({
    success: true,
    data: formattedData
  });
});

exports.getTopStocks = asyncHandler(async (req, res) => {

  const symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA"];

  const results = [];

  for (const symbol of symbols) {
    const response = await axios.get(
      "https://finnhub.io/api/v1/quote",
      {
        params: {
          symbol,
          token: process.env.FINNHUB_API_KEY
        }
      }
    );

    results.push({
      symbol,
      currentPrice: response.data.c,
      change: response.data.d,
      percentChange: response.data.dp
    });
  }

  res.status(200).json({
    success: true,
    data: results
  });
});