const Watchlist = require("../models/Watchlist");
const User = require("../models/User");
const { getCurrentStockPrice } = require("../services/stockService");
const axios = require("axios");

const API_KEY = process.env.FINNHUB_API_KEY;

const getUser = async (firebaseUID) => {
  const user = await User.findOne({ firebaseUID });
  if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
  return user;
};

// GET /watchlist/:firebaseUID
exports.getWatchlist = async (req, res) => {
  try {
    const user = await getUser(req.params.firebaseUID);
    let watchlist = await Watchlist.findOne({ user: user._id });
    if (!watchlist) return res.status(200).json({ symbols: [], stocks: [] });

    // Fetch live prices for all watchlist symbols
    const stockData = await Promise.all(
      watchlist.symbols.map((symbol) =>
        axios.get("https://finnhub.io/api/v1/quote", {
          params: { symbol, token: API_KEY },
        })
        .then((r) => ({
          symbol,
          currentPrice: r.data.c,
          change: r.data.d,
          percentChange: r.data.dp,
          high: r.data.h,
          low: r.data.l,
          open: r.data.o,
          prevClose: r.data.pc,
        }))
        .catch(() => ({ symbol, currentPrice: 0, change: 0, percentChange: 0 }))
      )
    );

    res.status(200).json({ symbols: watchlist.symbols, stocks: stockData });
  } catch (err) {
    console.error("Get Watchlist Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /watchlist/add
exports.addToWatchlist = async (req, res) => {
  try {
    const { firebaseUID, symbol } = req.body;
    const user = await getUser(firebaseUID);
    const sym = symbol.toUpperCase();

    const watchlist = await Watchlist.findOneAndUpdate(
      { user: user._id },
      { $addToSet: { symbols: sym } },
      { upsert: true, new: true }
    );
    res.status(200).json(watchlist);
  } catch (err) {
    console.error("Add Watchlist Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /watchlist/remove
exports.removeFromWatchlist = async (req, res) => {
  try {
    const { firebaseUID, symbol } = req.body;
    const user = await getUser(firebaseUID);

    const watchlist = await Watchlist.findOneAndUpdate(
      { user: user._id },
      { $pull: { symbols: symbol.toUpperCase() } },
      { new: true }
    );
    res.status(200).json(watchlist);
  } catch (err) {
    console.error("Remove Watchlist Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};