const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { Supplier } = require('../models/index');

router.get('/',       protect, async (req, res) => { res.json(await Supplier.find()); });
router.post('/',      protect, async (req, res) => { try { res.status(201).json(await Supplier.create(req.body)); } catch (e) { res.status(400).json({ message: e.message }); }});
router.put('/:id',    protect, async (req, res) => { res.json(await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true })); });
router.delete('/:id', protect, async (req, res) => { await Supplier.findByIdAndDelete(req.params.id); res.json({ message: 'Fournisseur supprimé' }); });

module.exports = router;
