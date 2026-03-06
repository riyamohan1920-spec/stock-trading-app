const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  stockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock"
  },
  quantity: Number
});

module.exports = mongoose.model("Portfolio", portfolioSchema);