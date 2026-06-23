// ─── categoryRoutes.js ──────────────────────────────────────────
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { Category } = require('../models/index');

router.get('/',     protect, async (req, res) => { res.json(await Category.find()); });
router.post('/',    protect, async (req, res) => { try { res.status(201).json(await Category.create(req.body)); } catch (e) { res.status(400).json({ message: e.message }); } });
router.put('/:id',  protect, async (req, res) => { res.json(await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })); });
router.delete('/:id', protect, async (req, res) => { await Category.findByIdAndDelete(req.params.id); res.json({ message: 'Catégorie supprimée' }); });

module.exports = router;
