const bcrypt = require('bcryptjs');
const User = require('../models/user.model');

module.exports = async (email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error('El usuario ya existe');
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  return { email: user.email, _id: user._id };
};
