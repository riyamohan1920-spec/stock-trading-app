const express = require('express');
const router = express.Router();
const { getAllStocks, getStockBySymbol } = require('../controllers/stockController');

router.get('/all', getAllStocks);
router.get('/:symbol', getStockBySymbol);

module.exports = router;
