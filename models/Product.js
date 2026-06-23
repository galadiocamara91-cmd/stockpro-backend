const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true,
  },
  description: { type: String, default: '' },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  alertQuantity: {
    type: Number,
    default: 5, // Alerte stock faible
  },
  image: { type: String, default: '' },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  barcode: { type: String, default: '' },
  isExpirable: { type: Boolean, default: false },
  expirationDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
