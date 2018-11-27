const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();


app.use(index);

const server = http.createServer(app);
const io = socketIo(server); // < This creates our socket using the instance of the server
let interval;

io.on("connection", socket => {

    var socketId = socket.id;
    var clientIp = socket.request.connection.remoteAddress;

    console.log('New connection ' + socketId + ' from ' + clientIp);

    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => {
        getApiAndEmit(socket)

    }, 1000);    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

});

const getApiAndEmit = async socket => {
  try {
    const res = await axios.get(
      "http://api.citybik.es/v2/networks/decobike-miami-beach"
    ); //API request
    io.emit("bikes", res.data); //emit data to channel bikes
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

server.listen(port, () => console.log(`Listening on port ${port}`));



