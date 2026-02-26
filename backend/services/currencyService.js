const axios = require("axios");

// ── In-memory cache for all rates ────────────────────────────────────────────
let cachedRates = null;
let cacheTimestamp = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

// Fallback rates if API is unreachable
const FALLBACK_RATES = {
  USD: 1,
  INR: 84,
  EUR: 0.92,
};

/**
 * Fetches all rates from USD base and caches them.
 * Returns an object: { USD: 1, INR: 84.xx, EUR: 0.9x }
 */
const getAllRates = async () => {
  const now = Date.now();

  if (cachedRates && cacheTimestamp && now - cacheTimestamp < CACHE_TTL) {
    return cachedRates;
  }

  try {
    console.log("Fetching fresh exchange rates...");
    const response = await axios.get(
      "https://api.exchangerate-api.com/v4/latest/USD",
      { timeout: 5000 }
    );

    const { INR, EUR } = response.data?.rates || {};
    if (!INR || !EUR) throw new Error("Missing rates in response");

    cachedRates = { USD: 1, INR, EUR };
    cacheTimestamp = now;

    console.log("Exchange rates cached:", cachedRates);
    return cachedRates;

  } catch (error) {
    console.error("Exchange rate fetch failed:", error.message);
    if (cachedRates) {
      console.warn("Using stale cached rates");
      return cachedRates;
    }
    console.warn("Using hardcoded fallback rates");
    return FALLBACK_RATES;
  }
};

/**
 * Returns the USD -> targetCurrency conversion rate.
 * @param {"USD"|"INR"|"EUR"} targetCurrency
 */
exports.getConversionRate = async (targetCurrency = "INR") => {
  const rates = await getAllRates();
  return rates[targetCurrency] ?? 1;
};

/**
 * Expose all rates (used by portfolio controller to avoid multiple fetches).
 */
exports.getAllRates = getAllRates;