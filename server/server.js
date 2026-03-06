const connectDB = require("./config/db");
connectDB();

require("./models/User");
require("./models/Stock");
require("./models/Transaction");
require("./models/Order");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./models/User");
require("./models/Stock");
require("./models/Transaction");
require("./models/Order");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Stock Trading API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});