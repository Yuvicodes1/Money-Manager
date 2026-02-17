// Import the axios library.
// Axios is used to send HTTP requests to external APIs (like the stock API).
const axios = require("axios");

// Get the API key from environment variables (.env file).
// process.env contains variables loaded using dotenv.
// Example .env:
// ALPHA_VANTAGE_API_KEY=your_key_here
const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;  // ADD THIS LINE

// Print the loaded API key to the console for debugging purposes.
// This helps verify whether the environment variable was loaded correctly.
console.log("Loaded API Key:", process.env.ALPHA_VANTAGE_API_KEY);


// Export a function so it can be used in other files.
// The function name is getCurrentStockPrice.
// It is marked as async because it performs asynchronous operations (API call).
// "symbol" is the stock ticker passed into the function (e.g., AAPL, TSLA).
exports.getCurrentStockPrice = async (symbol) => {

  try {

    // Send a GET request to the Alpha Vantage API using axios.
    // await pauses execution until the API responds.
    const response = await axios.get(
      `https://www.alphavantage.co/query`,
      {
        // params automatically converts this object into query parameters in the URL.
        // Final URL will look like:
        // https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=XXXX
        params: {
          function: "GLOBAL_QUOTE",   // API function to get current stock price
          symbol: symbol,            // Stock symbol passed into the function
          apikey: API_KEY             // API key for authentication
        },

        // timeout means the request will fail if no response is received within 5000 ms (5 seconds).
        timeout: 5000
      }
    );

    // Extract the "Global Quote" object from the API response.
    // Axios stores returned data inside response.data.
    const quote = response.data["Global Quote"];

    // Check if quote is empty or missing.
    // Object.keys(quote).length === 0 means the object has no properties.
    if (!quote || Object.keys(quote).length === 0) {

      // Print the full API response for debugging if empty.
      console.log("Empty quote response:", response.data);

      // Return 0 to avoid crashing the application.
      return 0;
    }

    // Log the raw API response for debugging and inspection.
    console.log("Alpha Raw:", response.data);

    // Convert the price string into a number.
    // Example: "182.34" → 182.34
    const price = parseFloat(quote["05. price"]);

    // Check if conversion failed (NaN = Not a Number).
    if (isNaN(price)) {

      // Log invalid data format for debugging.
      console.log("Invalid price format:", quote);

      // Return 0 if price is invalid.
      return 0;
    }

    // If everything is valid, return the numeric stock price.
    return price;

  } catch (error) {

    // Catch block handles any runtime errors:
    // - Network failure
    // - Timeout
    // - Invalid API key
    // - API server error

    console.error("Stock API error:", error.message);

    // Return 0 instead of throwing error to prevent backend crash.
    return 0; // prevent crash
  }
};
