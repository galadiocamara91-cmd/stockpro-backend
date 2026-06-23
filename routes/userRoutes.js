const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const User = require('../models/User');

// GET tous les utilisateurs (admin seulement)
router.get('/', protect, adminOnly, async (req, res) => {
  res.json(await User.find().select('-password'));
});

// PUT modifier un utilisateur
router.put('/:id', protect, adminOnly, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
  res.json(user);
});

// DELETE supprimer un utilisateur
router.delete('/:id', protect, adminOnly, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'Utilisateur supprimé' });
});

module.exports = router;
