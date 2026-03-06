const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  stockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock"
  },
  orderType: {
    type: String,
    enum: ["buy", "sell"]
  },
  quantity: Number,
  price: Number,
  status: {
    type: String,
    default: "completed"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", OrderSchema);