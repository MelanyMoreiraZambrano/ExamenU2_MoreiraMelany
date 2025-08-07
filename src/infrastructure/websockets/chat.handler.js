const Message = require('../../domain/models/message.model');
const authSocket = require('../middlewares/auth.middleware');

const messages = [];

function setupSocket(io) {
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
          user: socket.user.userId
        });

        await message.save();
        const populatedMsg = await message.populate('user', 'email');
        const newMessage = {
          _id: populatedMsg._id,
          text: populatedMsg.text,
          user: {
            _id: populatedMsg.user._id,
            email: populatedMsg.user.email
          },
          createdAt: populatedMsg.createdAt
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
}

module.exports = setupSocket;
