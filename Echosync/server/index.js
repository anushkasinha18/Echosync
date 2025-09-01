/* EchoSync - Realtime Code Collaboration Server */
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('EchoSync server is running');
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

// In-memory room state
// roomState = {
//   [roomId]: { code: string, users: { [socketId]: username } }
// }
const roomState = {};
const userMeta = {}; // socketId -> { roomId, username }

io.on('connection', (socket) => {
  // Client joined a room
  socket.on('JOIN', ({ roomId, username }) => {
    if (!roomId) return;
    const safeName = (username && String(username).trim()) || 'Anonymous';
    socket.join(roomId);
    userMeta[socket.id] = { roomId, username: safeName };

    if (!roomState[roomId]) roomState[roomId] = { code: '', users: {} };
    roomState[roomId].users[socket.id] = safeName;

    // Send current code to the new client
    socket.emit('CODE_INIT', roomState[roomId].code);

    // Send updated users list to room
    const users = Object.entries(roomState[roomId].users).map(([id, name]) => ({
      socketId: id,
      username: name,
    }));
    io.to(roomId).emit('USERS', users);

    // Notify others
    socket.to(roomId).emit('USER_JOINED', { socketId: socket.id, username: safeName });
  });

  // Code change propagated to others
  socket.on('CODE_CHANGE', ({ roomId, code }) => {
    if (!roomId) return;
    if (!roomState[roomId]) roomState[roomId] = { code: '', users: {} };
    roomState[roomId].code = typeof code === 'string' ? code : '';
    socket.to(roomId).emit('CODE_CHANGE', roomState[roomId].code);
  });

  // Broadcast cursor/selection info
  socket.on('CURSOR', ({ roomId, cursor }) => {
    if (!roomId) return;
    socket.to(roomId).emit('CURSOR', { socketId: socket.id, cursor });
  });

  // Handle disconnects & update user lists
  socket.on('disconnecting', () => {
    const meta = userMeta[socket.id];
    if (!meta) return;
    const { roomId, username } = meta;

    if (roomState[roomId] && roomState[roomId].users) {
      delete roomState[roomId].users[socket.id];
      const users = Object.entries(roomState[roomId].users).map(([id, name]) => ({
        socketId: id,
        username: name,
      }));
      io.to(roomId).emit('USERS', users);
    }

    socket.to(roomId).emit('USER_LEFT', { socketId: socket.id, username });
    delete userMeta[socket.id];
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`EchoSync server listening on http://localhost:${PORT}`);
});
