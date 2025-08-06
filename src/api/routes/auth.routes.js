const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Ruta para iniciar el proceso de autenticación con Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Ruta de callback a la que Google redirige tras la autorización
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login-error' }),
  (req, res) => {
    // ¡Autenticación exitosa! `req.user` contiene los datos del usuario.
    // Aquí es donde generas tu propio JWT
    // const token = generateToken({ id: req.user.id, email: req.user.email, role: req.user.role });

    // --- SIMULACIÓN PARA LA TAREA ---
    const mockToken =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1IiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

    // Redirige al frontend con el token como query parameter
    res.redirect(`http://localhost:3001/auth/callback?token=${mockToken}`);
  }
);

module.exports = router;
