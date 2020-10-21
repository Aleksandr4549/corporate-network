import express from 'express';
import dotenv from 'dotenv';
import bodyParser from "body-parser";

dotenv.config();

import UserController from './controllers/UserController';
import MessageController from './controllers/MessageController';
import FileController from './controllers/FileController';
import {registerbody} from './validations/register';
import checkAuth from './middlewares/checkAuth';
import multer from './core/multer';

const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(checkAuth);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('corporate-network-frontend/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'corporate-network-frontend', 'build', 'index.html'));
  });
}

app.get('/user', UserController.index);
app.post('/signup', registerbody, UserController.signup);
app.post('/login', UserController.login);

app.get('/me', UserController.getMe);
app.get('/user/:id', UserController.show);
app.delete('/user/:id', UserController.delete);

app.get('/working', MessageController.index);
app.post('/working', MessageController.create);
app.delete('/working/:id', MessageController.delete);

app.get('/flooding', MessageController.index);
app.post('/flooding', MessageController.create);
app.delete('/flooding/:id', MessageController.delete);

app.post('/files', multer.single('file'), FileController.create);
app.delete("/files", FileController.delete);

app.listen(process.env.PORT, (): void => {
  console.log(`Server started: port ${process.env.PORT}`);
});