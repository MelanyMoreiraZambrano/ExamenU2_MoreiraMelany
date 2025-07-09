const Message = require('../../domain/models/message.model');

module.exports = (io) => {
  io.on('connection', (socket) => {
    // Evento para recibir mensajes
    socket.on('sendMessage', async (data) => {
      try {
        const message = new Message({
          text: data.text,
          user: socket.user.userId
        });
        await message.save();
        const populatedMsg = await message.populate('user', 'email');
        io.emit('newMessage', {
          _id: populatedMsg._id,
          text: populatedMsg.text,
          user: { _id: populatedMsg.user._id, email: populatedMsg.user.email },
          createdAt: populatedMsg.createdAt
        });
      } catch (err) {
        socket.emit('error', { error: 'No se pudo enviar el mensaje' });
      }
    });
  });
};
