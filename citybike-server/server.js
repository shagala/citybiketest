const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");



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
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


const getApiAndEmit = async socket => {
  console.log("get api and emit");
  const res = await axios.get("http://api.citybik.es/v2/networks/decobike-miami-beach");
  console.log("antes de emitir mensaje");
  //console.log(res);
  //console.log(res.data.network.stations);
  socket.emit("messages", res.data.network.stations);
};

server.listen(port, () => console.log(`Listening on port ${port}`));



