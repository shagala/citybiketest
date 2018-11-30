/**
 * server.js
 * version: 1.0 by Renne Castellanos
 * 
 * Last version of functional server file to consult to the web API
 *    for the bikes registered in the provider server, and retrieve
 *    the specific data of interest to the client to reduce the 
 *    communication and loading time.
 */

// Defautl constants
const axios = require("axios");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();

app.use(index);

// Server creation proccess
const server = http.createServer(app);
const io = socketIo(server);

// Consulting time local variable definition
let interval;

// Listener of the connection
io.on("connection", socket => {

  // Local variables
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;

  // Control log
  console.log('New connection ' + socketId + ' from ' + clientIp);

  // Interval verification
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);

  // Listener of diconnection
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  // Listener of the request for the bikes consult
  socket.on("FromAPI", (data) => { socket.broadcast.emit('FromAPI', data) });
});

// Default provided asyncronus function with a modification to set the data
//    at the moment it is retrieved.
const getApiAndEmit = async socket => {
  try {

    // Request to the provider
    const res = await axios.get(
      "http://api.citybik.es/v2/networks/decobike-miami-beach"
    );

    // Definition of the data to be retrieved to reduce the load in the client
    data = res.data.network.stations;
  } catch (error) {

    // Log the error
    console.error(`Error: ${error.code}`);
  }
};

// Server listener
server.listen(port, () => console.log(`Listening on port ${port}`));



