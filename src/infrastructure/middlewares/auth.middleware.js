const jwt = require('jsonwebtoken');
const User = require('../../domain/models/user.model'); // Asegúrate de tener este modelo
const JWT_SECRET = process.env.JWT_SECRET || 'password123';

async function authSocket(socket, next) {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('No token provided'));

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id); // o decoded._id

    if (!user) return next(new Error('User not found'));

    socket.user = user; // Ahora es el usuario completo
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
}

module.exports = authSocket;
