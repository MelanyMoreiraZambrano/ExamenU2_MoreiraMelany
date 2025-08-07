const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('../../domain/models/message.model');
const authSocket = require('./middlewares/authSocket');

const app = express();

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",  // Cambia esto si es necesario
    methods: ["GET", "POST"],
  },
});

const messages = [];

// Middleware para autenticación de socket
io.use(authSocket);

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.user?.email);

  socket.on('getMessages', () => {
    socket.emit('messages', messages);
  });

  socket.on('message', async (msg) => {
    try {
      const message = new Message({
        text: msg.text,
        user: socket.user.userId, // Asegúrate que userId existe en el token
      });
      await message.save();
      const populatedMsg = await message.populate('user', 'email');
      const newMessage = {
        _id: populatedMsg._id,
        text: populatedMsg.text,
        user: { _id: populatedMsg.user._id, email: populatedMsg.user.email },
        createdAt: populatedMsg.createdAt,
      };
      messages.push(newMessage);
      io.emit('message', newMessage);
    } catch (err) {
      socket.emit('error', { error: 'No se pudo enviar el mensaje' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
