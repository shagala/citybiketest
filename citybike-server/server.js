const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const api_endpoint = 'http://api.citybik.es/v2/networks/decobike-miami-beach';

const port = process.env.PORT || 4000;
const index = require('./routes/index');
const app = express();

app.use(index);

const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
let interval;

io.on('connection', socket => {
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
  console.log('New connection ' + socketId + ' from ' + clientIp);
  if (interval) {
    clearInterval(interval);
  }
  //Calling the api's endpoint to get the free bikes
  interval = setInterval(() => getBikes(socket), 3000);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

//method to call the api and emmit the data to view
const getBikes = async socket => {
  try {
    const res = await axios.get(api_endpoint);
    socket.emit('bikesApi', res.data);
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

server.listen(port, () => console.log(`Listening on port ${port}`));