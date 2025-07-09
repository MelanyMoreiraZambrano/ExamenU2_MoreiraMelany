const registerUser = require('../../domain/use-cases/register-user.use-case');
const loginUser = require('../../domain/use-cases/login-user.use-case');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await registerUser(email, password);
    res.status(201).json({ message: 'Usuario registrado', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const token = await loginUser(email, password);
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
