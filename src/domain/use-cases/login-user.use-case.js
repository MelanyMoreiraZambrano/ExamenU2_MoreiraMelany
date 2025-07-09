const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Credenciales inválidas');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Credenciales inválidas');
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return token;
};
