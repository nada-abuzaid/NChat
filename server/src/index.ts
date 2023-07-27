import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { Server as socketIO } from 'socket.io';
import {
  getMessagesController,
  getUsersController,
  insertMessageController,
  loginController,
  logoutController,
  setAvatarController,
  signupController,
} from './controllers';

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get('/api/multiavatar', async (req, res) => {
  const apiUrl = `https://api.multiavatar.com/4645646/${Math.round(
    Math.random() * 1000
  )}?apikey=${process.env.API_KEY}`;
  const imageResponse = await axios(apiUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });

  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(imageResponse.data);
});

app.post('/api/auth/login', loginController);
app.post('/api/auth/register', signupController);
app.post('/api/auth/setAvatar/:id', setAvatarController);
app.get('/api/auth/users/:id', getUsersController);
app.get('/api/auth/logout', logoutController);
app.post('/api/messages/message', insertMessageController);
app.post('/api/messages', getMessagesController);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on http://localhost:${process.env.PORT}`)
);

const io = new socketIO(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

const onlineUsers: Map<string, string> = new Map();
let chatSocket;

io.on('connection', (socket) => {
  chatSocket = socket;
  socket.on('add-user', (userId) => {
    console.log(userId);
    
    onlineUsers.set(userId, socket.id);
  });

  socket.on('send-msg', (data) => {
    
    const sendUserSocket = onlineUsers.get(data.to);
    console.log(data.to, onlineUsers, sendUserSocket);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-receive', data);
    }
  });
});
