const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Email déjà utilisé' });
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => res.json(req.user);

// @POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Aucun compte avec cet email' });

    // Générer un code de reset à 6 chiffres
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    user.resetCode = resetCode;
    user.resetExpiry = resetExpiry;
    await user.save({ validateBeforeSave: false });

    // En production, envoyer par email. Ici on retourne le code (démo)
    res.json({
      message: 'Code de réinitialisation généré',
      resetCode, // En prod: ne pas retourner, envoyer par email
      email: user.email,
      note: 'En production, ce code serait envoyé par email'
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const user = await User.findOne({
      email,
      resetCode: code,
      resetExpiry: { $gt: Date.now() }
    });
    if (!user) return res.status(400).json({ message: 'Code invalide ou expiré' });

    user.password = newPassword;
    user.resetCode = undefined;
    user.resetExpiry = undefined;
    await user.save();

    res.json({ message: 'Mot de passe réinitialisé avec succès !' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
