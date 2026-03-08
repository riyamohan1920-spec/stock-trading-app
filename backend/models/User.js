const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const portfolioItemSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  companyName: { type: String, required: true },
  quantity: { type: Number, required: true, default: 0 },
  avgBuyPrice: { type: Number, required: true, default: 0 },
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  balance: { type: Number, default: 100000 }, // Default $1,00,000
  portfolio: [portfolioItemSchema],
  watchlist: [{ type: String }], // Array of stock symbols
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
