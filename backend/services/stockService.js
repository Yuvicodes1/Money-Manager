// Import axios for making HTTP requests
const axios = require("axios");

// Import cache helper functions
const { getFromCache, setCache } = require("../utils/cache");

// Get API key from environment variables
const API_KEY = process.env.FINNHUB_API_KEY;

// Log API key to verify it loaded correctly
console.log("Loaded Finnhub API Key:", API_KEY);


// ==============================
// Function to get current stock price
// ==============================
exports.getCurrentStockPrice = async (symbol) => {
  try {

    // 1️⃣ Check cache first
    const cachedPrice = getFromCache(symbol);
    if (cachedPrice) {
      console.log("Cache hit for:", symbol);
      return cachedPrice;
    }

    console.log("Fetching from Finnhub:", symbol);

    // 2️⃣ Call Finnhub Quote API
    const response = await axios.get(
      "https://finnhub.io/api/v1/quote",
      {
        params: {
          symbol: symbol,
          token: API_KEY,
        },
        timeout: 5000
      }
    );

    /*
      Finnhub Response Example:
      {
        c: 189.30,   // current price
        h: 190.20,
        l: 187.00,
        o: 188.00,
        pc: 185.00
      }
    */

    const price = response.data.c;

    // 3️⃣ Validate price
    if (!price || isNaN(price)) {
      console.log("Invalid price response:", response.data);
      return 0;
    }

    // 4️⃣ Store in cache
    setCache(symbol, price);

    return price;

  } catch (error) {

    console.error("Finnhub API error:", error.message);
    return 0;
  }
};



// ==============================
// Function to get historical stock data
// ==============================
exports.getStockHistory = async (symbol) => {
  try {

    const now = Math.floor(Date.now() / 1000);
    const oneMonthAgo = now - 60 * 60 * 24 * 30;

    const response = await axios.get(
      "https://finnhub.io/api/v1/stock/candle",
      {
        params: {
          symbol: symbol,
          resolution: "D",  // Daily candles
          from: oneMonthAgo,
          to: now,
          token: API_KEY,
        },
        timeout: 5000
      }
    );

    /*
      Response example:
      {
        c: [prices],
        t: [timestamps],
        s: "ok"
      }
    */

    if (response.data.s !== "ok") {
      console.log("No historical data found.");
      return [];
    }

    // Convert Finnhub format into clean array
    const history = response.data.t.map((timestamp, index) => ({
      date: new Date(timestamp * 1000),
      price: response.data.c[index],
    }));

    return history;

  } catch (error) {
    console.error("History API error:", error.message);
    return [];
  }
};