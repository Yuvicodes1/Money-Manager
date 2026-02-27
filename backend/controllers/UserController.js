const User = require("../models/User");

const SUPPORTED_CURRENCIES = ["USD", "EUR", "INR"];

// ==============================
// Create or find user
// ==============================
exports.createUser = async (req, res) => {
  try {
    const { firebaseUID, email, name } = req.body;
    if (!firebaseUID || !email || !name) {
      return res.status(400).json({ message: "firebaseUID, email, and name are required" });
    }
    const existingUser = await User.findOne({ firebaseUID });
    if (existingUser) return res.status(200).json(existingUser);
    const newUser = await User.create({ firebaseUID, email, name });
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// GET user settings
// Now returns name + email + currency
// ==============================
exports.getUserSettings = async (req, res) => {
  try {
    const { firebaseUID } = req.params;
    const user = await User.findOne({ firebaseUID });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      name: user.name,
      displayName: user.name,   // alias so HomePage can use either field
      email: user.email,
      preferredCurrency: user.preferredCurrency,
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// PUT user settings
// Now handles name + currency updates
// ==============================
exports.updateUserSettings = async (req, res) => {
  try {
    const { firebaseUID } = req.params;
    const { preferredCurrency, displayName } = req.body;

    const updateFields = {};

    if (preferredCurrency !== undefined) {
      if (!SUPPORTED_CURRENCIES.includes(preferredCurrency)) {
        return res.status(400).json({
          message: `Invalid currency. Supported: ${SUPPORTED_CURRENCIES.join(", ")}`,
        });
      }
      updateFields.preferredCurrency = preferredCurrency;
    }

    if (displayName !== undefined && displayName.trim()) {
      updateFields.name = displayName.trim();
    }

    const user = await User.findOneAndUpdate(
      { firebaseUID },
      updateFields,
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      message: "Settings updated successfully",
      name: user.name,
      displayName: user.name,
      preferredCurrency: user.preferredCurrency,
    });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};