const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  stockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock"
  },
  type: {
    type: String,
    enum: ["buy", "sell"]
  },
  quantity: Number,
  price: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Transaction", transactionSchema);