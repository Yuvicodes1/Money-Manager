// Import axios for making HTTP requests
const axios = require("axios");

// Import cache helper functions
const { getFromCache, setCache } = require("../utils/cache");

// Get API key from environment variables
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// Log API key to verify it loaded correctly
console.log("Loaded API Key:", process.env.ALPHA_VANTAGE_API_KEY);


// Function to get current stock price
exports.getCurrentStockPrice = async (symbol) => {
  try {

    // Check if price exists in cache
    const cachedPrice = getFromCache(symbol);
    if (cachedPrice) {
      console.log("Cache hit for:", symbol);
      return cachedPrice;
    }

    console.log("Fetching from API:", symbol);

    // Call Alpha Vantage API
    const response = await axios.get(
      `https://www.alphavantage.co/query`,
      {
        params: {
          function: "GLOBAL_QUOTE", // API function
          symbol: symbol,          // Stock symbol
          apikey: API_KEY          // API key
        },
        timeout: 5000 // 5 sec timeout
      }
    );

    // Extract quote data
    const quote = response.data["Global Quote"];

    // Handle empty response
    if (!quote || Object.keys(quote).length === 0) {
      console.log("Empty quote response:", response.data);
      return 0;
    }

    // Convert price to number
    const price = parseFloat(quote["05. price"]);

    // Return 0 if invalid price
    if (isNaN(price)) {
      return 0;
    }

    // Store price in cache
    setCache(symbol, price);

    // Return stock price
    return price;

  } catch (error) {

    // Handle API errors safely
    console.error("Stock API error:", error.message);
    return 0;
  }
};
