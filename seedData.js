const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Product = require('./models/Product');
const { Category, Supplier, StockEntry, Sale } = require('./models/index');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connecté à MongoDB');

  // Récupérer admin
  const admin = await User.findOne({ role: 'admin' });
  if (!admin) { console.log('❌ Aucun admin trouvé. Créez d\'abord un compte admin.'); process.exit(1); }

  // Catégories
  const categories = await Category.insertMany([
    { name: 'Électronique' },
    { name: 'Alimentation' },
    { name: 'Vêtements' },
    { name: 'Informatique' },
    { name: 'Téléphonie' },
  ]);
  console.log('✅ Catégories créées');

  // Fournisseurs
  const suppliers = await Supplier.insertMany([
    { name: 'TechSupply Mauritanie', phone: '22211223344', email: 'tech@supply.mr', address: 'Nouakchott' },
    { name: 'AlimImport SARL', phone: '22233445566', email: 'alim@import.mr', address: 'Nouadhibou' },
    { name: 'ModaDistrib', phone: '22244556677', email: 'moda@distrib.mr', address: 'Rosso' },
  ]);
  console.log('✅ Fournisseurs créés');

  // Produits
  const products = await Product.insertMany([
    { name: 'Samsung Galaxy A54', price: 85000, quantity: 15, alertQuantity: 3, category: categories[0]._id, description: 'Smartphone 128GB' },
    { name: 'iPhone 14', price: 180000, quantity: 8, alertQuantity: 2, category: categories[4]._id, description: 'Apple iPhone 14' },
    { name: 'Laptop Dell Inspiron', price: 220000, quantity: 5, alertQuantity: 2, category: categories[3]._id, description: 'Intel i5 8GB RAM' },
    { name: 'Riz Basmati 5kg', price: 3500, quantity: 150, alertQuantity: 20, category: categories[1]._id, description: 'Riz premium' },
    { name: 'Huile Végétale 1L', price: 1200, quantity: 200, alertQuantity: 30, category: categories[1]._id, description: 'Huile de tournesol' },
    { name: 'Sucre 2kg', price: 1800, quantity: 3, alertQuantity: 25, category: categories[1]._id, description: 'Sucre raffiné' },
    { name: 'Boubou Traditionnel', price: 12000, quantity: 30, alertQuantity: 5, category: categories[2]._id, description: 'Boubou homme coton' },
    { name: 'Robe Moderne', price: 8500, quantity: 25, alertQuantity: 5, category: categories[2]._id, description: 'Robe femme été' },
    { name: 'Casque Bluetooth', price: 15000, quantity: 20, alertQuantity: 4, category: categories[0]._id, description: 'Sony WH-1000XM4' },
    { name: 'Clavier USB', price: 4500, quantity: 2, alertQuantity: 5, category: categories[3]._id, description: 'Clavier AZERTY' },
  ]);
  console.log('✅ Produits créés');

  // Entrées stock
  const entries = [];
  for (let i = 0; i < products.length; i++) {
    for (let j = 0; j < 3; j++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      entries.push({
        product: products[i]._id,
        supplier: suppliers[i % suppliers.length]._id,
        quantity: Math.floor(Math.random() * 20) + 5,
        unitPrice: Math.floor(products[i].price * 0.7),
        createdBy: admin._id,
        createdAt: date,
      });
    }
  }
  await StockEntry.insertMany(entries);
  console.log('✅ Entrées stock créées');

  // Ventes sur 30 jours
  const salesData = [];
  for (let day = 30; day >= 0; day--) {
    const nbSales = Math.floor(Math.random() * 5) + 1;
    for (let s = 0; s < nbSales; s++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const date = new Date();
      date.setDate(date.getDate() - day);
      date.setHours(Math.floor(Math.random() * 12) + 8);
      salesData.push({
        product: product._id,
        quantity,
        unitPrice: product.price,
        totalPrice: quantity * product.price,
        createdBy: admin._id,
        createdAt: date,
      });
    }
  }
  await Sale.insertMany(salesData);
  console.log(`✅ ${salesData.length} ventes créées`);

  console.log('\n🎉 Données de test insérées avec succès !');
  console.log('📊 Ouvrez le Dashboard pour voir les graphiques !');
  process.exit(0);
};

seed().catch(err => { console.error('❌ Erreur:', err.message); process.exit(1); });