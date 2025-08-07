const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const { generateJWT } = require('../../utils/jwt'); // <-- Importa la función aquí

router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta para iniciar el proceso de autenticación con Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Ruta de callback a la que Google redirige tras la autorización
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  // Genera el token JWT para el usuario autenticado
  const token = generateJWT(req.user);
  // Redirige al frontend con el token y el email
  res.redirect(`http://localhost:3000/auth/callback?token=${token}&email=${encodeURIComponent(req.user.email)}`);
});

module.exports = router;
