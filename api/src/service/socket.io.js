const { Server } = require('socket.io');
const participantRepository = require('../repositories/ParticipantRepository');
const messageRepository = require('../repositories/MessageRepository');
const accountRepository = require('../repositories/AccountRepository');

function setupSocketIO(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // When a client connect
  io.on('connection', async (socket) => {
    console.log('New client connected: ', socket.id);

    // When a client joins a room
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`Client ${socket.id} join room: ${roomId}`);
    });

    // When a client send a message in a conversation
    socket.on('sendMessage', async ({ pkConversation, messageFormated }) => {
      // Save the message to the database
      const pkMessage = await messageRepository.create(pkConversation, messageFormated.fk_member, messageFormated.content_text, messageFormated.sent_at);

      // Get sender name
      const senderName = await accountRepository.findByPk(messageFormated.fk_member).then(member => member.first_name);
      
      // Emit the message to the room
      io.to(pkConversation).emit('receiveMessage', {
        pk: pkMessage,
        fk_member: messageFormated.fk_member,
        content_text: messageFormated.content_text,
        sent_at: messageFormated.sent_at,
        first_name: senderName
      });

      // Emit the update to all participants in the conversation
      const participants = await participantRepository.listAllParticipantsFromOneConversation(pkConversation);

      for(let i = 0; i < participants.length; i++) {
        io.emit(`conversation:update:${participants[i].fk_member}`, {
          pk: pkConversation,
          title: messageFormated.title,
          last_message_sender_pk: messageFormated.fk_member,
          last_message_sender: senderName,
          last_message_text: messageFormated.content_text,
          last_message_time: messageFormated.sent_at,
          type_conversation: participants.length > 2 ? true : false
        });
      }
    });

    // When a client disconnects
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

module.exports = setupSocketIO;