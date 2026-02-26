const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firebaseUID: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    // ── Currency preference ─────────────────────────────────────────────────
    preferredCurrency: {
      type: String,
      enum: ["USD", "EUR", "INR"],
      default: "INR",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);