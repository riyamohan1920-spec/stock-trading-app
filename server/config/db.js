const mongoose = require("mongoose");

const connectDB = async () => {
  try {
await mongoose.connect(
"mongodb+srv://hardikgupta52226_db_user:Hardik123@cluster0.rbl0q8v.mongodb.net/stocktrading"
);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

module.exports = connectDB;