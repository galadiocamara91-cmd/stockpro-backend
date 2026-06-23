const mongoose = require('mongoose');

// ── Category ──────────────────────────────────────────────────
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
}, { timestamps: true });

// ── Supplier ──────────────────────────────────────────────────
const supplierSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  phone:   { type: String, default: '' },
  email:   { type: String, default: '' },
  address: { type: String, default: '' },
}, { timestamps: true });

// ── StockEntry (Entrée de stock) ───────────────────────────────
const stockEntrySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
  },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  note: { type: String, default: '' },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

// ── Sale (Sortie / Vente) ──────────────────────────────────────
const saleSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity:   { type: Number, required: true, min: 1 },
  unitPrice:  { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 },
  note: { type: String, default: '' },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = {
  Category:   mongoose.model('Category',   categorySchema),
  Supplier:   mongoose.model('Supplier',   supplierSchema),
  StockEntry: mongoose.model('StockEntry', stockEntrySchema),
  Sale:       mongoose.model('Sale',       saleSchema),
};
