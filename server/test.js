const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>')
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(3001, () => {
  console.log('listening on *:3001');
});