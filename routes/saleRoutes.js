const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { Sale } = require('../models/index');
const Product = require('../models/Product');

// GET toutes les ventes
router.get('/', protect, async (req, res) => {
  const sales = await Sale.find()
    .populate('product', 'name price')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });
  res.json(sales);
});

// POST enregistrer une vente
router.post('/', protect, async (req, res) => {
  try {
    const { product, quantity, unitPrice } = req.body;

    // Vérifier stock suffisant
    const prod = await Product.findById(product);
    if (!prod) return res.status(404).json({ message: 'Produit introuvable' });
    if (prod.quantity < quantity) return res.status(400).json({ message: 'Stock insuffisant' });

    const totalPrice = quantity * unitPrice;
    const sale = await Sale.create({ product, quantity, unitPrice, totalPrice, createdBy: req.user._id });

    // Déduire du stock
    await Product.findByIdAndUpdate(product, { $inc: { quantity: -quantity } });

    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET statistiques des ventes
router.get('/stats', protect, async (req, res) => {
  try {
    const totalSales = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' }, count: { $sum: 1 } } }
    ]);

    const topProducts = await Sale.aggregate([
      { $group: { _id: '$product', totalQty: { $sum: '$quantity' }, totalRevenue: { $sum: '$totalPrice' } } },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
    ]);

    res.json({ totalSales: totalSales[0] || {}, topProducts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
