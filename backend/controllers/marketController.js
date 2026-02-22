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

  res.status(200).json({
    success: true,
    data: response.data.result
  });
});



// ======================================================
// 📈 GET HISTORICAL DATA (Yahoo Finance)
// ======================================================
exports.getHistoricalData = asyncHandler(async (req, res) => {
  const { symbol, range } = req.query;

  if (!symbol) {
    const error = new Error("Symbol is required");
    error.statusCode = 400;
    throw error;
  }

  // 🔹 Map frontend range → Yahoo range
  let yahooRange = "1mo";
  if (range === "6M") yahooRange = "6mo";
  if (range === "1Y") yahooRange = "1y";

  const cacheKey = `history_${symbol}_${yahooRange}`;

  // ✅ Check cache first
  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log("Yahoo history cache hit:", symbol);
    return res.status(200).json({
      success: true,
      data: cached
    });
  }

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${yahooRange}&interval=1d`;

  const response = await axios.get(url);

  if (!response.data.chart || !response.data.chart.result) {
    return res.status(200).json({
      success: true,
      data: []
    });
  }

  const result = response.data.chart.result[0];
  const timestamps = result.timestamp;
  const closes = result.indicators.quote[0].close;

  const formattedData = timestamps.map((time, index) => ({
    date: new Date(time * 1000).toISOString().split("T")[0],
    close: closes[index]
  }));

  // ✅ Save to cache
  setCache(cacheKey, formattedData);

  res.status(200).json({
    success: true,
    data: formattedData
  });
});



// ======================================================
// 📊 GET TOP STOCKS (Finnhub Quotes)
// ======================================================
exports.getTopStocks = asyncHandler(async (req, res) => {
  const symbols = [
    "AAPL","MSFT","GOOGL","AMZN","TSLA",
    "NVDA","META","NFLX","AMD","INTC",
    "ORCL","IBM","ADBE","CRM","PYPL",
    "UBER","SHOP","SQ","BABA",
    "NKE","DIS","KO","PEP","WMT",
    "COST","HD","MCD",
    "PFE","JNJ","MRK",
    "XOM","BA","CAT",
    "PLTR","SNOW",
    "SPOT","ZM",
    "PANW","CRWD","DDOG",
    "ASML","QCOM","AVGO"
  ];

  const requests = symbols.map(symbol =>
    axios.get("https://finnhub.io/api/v1/quote", {
      params: { symbol, token: API_KEY }
    }).then(response => ({
      symbol,
      currentPrice: response.data.c,
      change: response.data.d,
      percentChange: response.data.dp
    })).catch(() => null) // ignore failed symbols
  );

  const results = (await Promise.all(requests)).filter(Boolean);

  res.status(200).json({
    success: true,
    data: results
  });
});