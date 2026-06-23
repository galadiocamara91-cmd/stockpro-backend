const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { StockEntry } = require('../models/index');
const Product = require('../models/Product');

// GET toutes les entrées de stock
router.get('/', protect, async (req, res) => {
  const entries = await StockEntry.find()
    .populate('product', 'name')
    .populate('supplier', 'name')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });
  res.json(entries);
});

// POST ajouter une entrée de stock
router.post('/', protect, async (req, res) => {
  try {
    const entry = await StockEntry.create({ ...req.body, createdBy: req.user._id });

    // Mettre à jour la quantité du produit
    await Product.findByIdAndUpdate(req.body.product, {
      $inc: { quantity: req.body.quantity },
    });

    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
