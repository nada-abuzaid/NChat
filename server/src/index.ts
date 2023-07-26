import express from 'express';
import cors from 'cors';
import axios from 'axios';
import { loginController, setAvatarController, signupController } from './controllers';

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

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on http://localhost:${process.env.PORT}`)
);
