const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Le nom est requis'], trim: true },
  email: { type: String, required: [true, "L'email est requis"], unique: true, lowercase: true },
  password: { type: String, required: [true, 'Le mot de passe est requis'], minlength: 6, select: false },
  role: { type: String, enum: ['admin', 'employe'], default: 'employe' },
  resetCode: { type: String },
  resetExpiry: { type: Date },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
