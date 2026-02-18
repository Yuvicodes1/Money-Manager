const Portfolio = require("../models/Portfolio");
const { getCurrentStockPrice } = require("../services/stockService");

// Create portfolio (if not exists)
exports.createPortfolio = async (req, res) => {
  try {
    const { userId } = req.body;

    const existingPortfolio = await Portfolio.findOne({ user: userId });

    if (existingPortfolio) {
      return res.status(200).json(existingPortfolio);
    }

    const newPortfolio = await Portfolio.create({
      user: userId,
      stocks: []
    });

    res.status(201).json(newPortfolio);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add stock to portfolio
exports.addStock = async (req, res) => {
  try {
    const { userId, symbol, quantity, buyPrice } = req.body;

    const portfolio = await Portfolio.findOne({ user: userId });

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    portfolio.stocks.push({ symbol, quantity, buyPrice });

    await portfolio.save();

    res.status(200).json(portfolio);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get portfolio
exports.getPortfolio = async (req, res) => {
  try {
    const { userId } = req.params;

    const portfolio = await Portfolio.findOne({ user: userId }).populate("user");

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    let totalInvested = 0;
    let totalCurrentValue = 0;

    const enrichedStocks = [];
    console.log("Portfolio Stocks:", portfolio.stocks);

    for (const stock of portfolio.stocks) {
      const currentPrice = await getCurrentStockPrice(stock.symbol);
      console.log("Processing stock:", stock.symbol);

      const investedAmount = stock.quantity * stock.buyPrice;
      const currentValue = stock.quantity * currentPrice;
      const profitLoss = parseFloat((currentValue - investedAmount).toFixed(2));

      totalInvested += investedAmount;
      totalCurrentValue += currentValue;

      enrichedStocks.push({
        symbol: stock.symbol,
        quantity: stock.quantity,
        buyPrice: stock.buyPrice,
        currentPrice,
        investedAmount,
        currentValue,
        profitLoss
      });
    }

    const totalProfitLoss = parseFloat((totalCurrentValue - totalInvested).toFixed(2));

    res.status(200).json({
      user: portfolio.user,
      stocks: enrichedStocks,
      summary: {
        totalInvested,
        totalCurrentValue,
        totalProfitLoss
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update stock in portfolio
exports.updateStock = async (req, res) => {
  try {
    const { userId, symbol, quantity, buyPrice } = req.body;

    if (!userId || !symbol) {
      return res.status(400).json({
        success: false,
        message: "userId and symbol are required"
      });
    }

    const portfolio = await Portfolio.findOne({ user: userId });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found"
      });
    }

    const stock = portfolio.stocks.find(
      (s) => s.symbol === symbol
    );

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: "Stock not found in portfolio"
      });
    }

    if (quantity !== undefined) {
      stock.quantity = quantity;
    }

    if (buyPrice !== undefined) {
      stock.buyPrice = buyPrice;
    }

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message: "Stock updated successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

//remove stock from portfolio
exports.removeStock = async (req, res) => {
  try {
    const { userId, symbol } = req.body;

    if (!userId || !symbol) {
      return res.status(400).json({
        success: false,
        message: "userId and symbol are required"
      });
    }

    const portfolio = await Portfolio.findOne({ user: userId });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found"
      });
    }

    const initialLength = portfolio.stocks.length;

    portfolio.stocks = portfolio.stocks.filter(
      (stock) => stock.symbol !== symbol
    );

    if (portfolio.stocks.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: "Stock not found in portfolio"
      });
    }

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message: "Stock removed successfully"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
