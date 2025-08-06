require('dotenv').config();
const express = require('express');
const http = require('http');
const connectDB = require('./src/config/db');
const { Server } = require('socket.io');
const chatHandler = require('./src/infrastructure/websockets/chat.handler');
const authSocket = require('./src/infrastructure/middlewares/auth.middleware');
const cors = require('cors');
const passport = require('passport');
require('./src/config/passport-setup'); // Asegúrate que la ruta sea correcta

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
io.use(authSocket);
app.use(passport.initialize());

// Rutas
const authRoutes = require('./src/api/routes/auth.routes');
app.use('/api/auth', authRoutes);

// Conexión a la base de datos
connectDB();
chatHandler(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
