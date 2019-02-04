const axios = require("axios");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const citybikeurl = "http://api.citybik.es/v2/networks/decobike-miami-beach"

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();


app.use(index);

const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
let interval;



io.on("connection", socket => {
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
  console.log('New connection ' + socketId + ' from ' + clientIp);
  interval = setInterval(() => getemitAxios(socket), 6000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const getemitAxios = async socket => {
  try {
    const res = await axios.get(citybikeurl);
    socket.emit('socketApi', res.data);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

server.listen(port, () => console.log(`Listening on port ${port}`));