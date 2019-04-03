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

  var request = http.get(citybikeurl, function (response) {

    var buffer = "", data, route;

    response.on("data", function (chunk) {
        buffer += chunk;
    });

    response.on("end", function (err) {

        data = JSON.parse(buffer);
        io.emit('location', data['network']['location']);
        io.emit('stations', data['network']['stations']);

    });
  });


  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
  console.log('New connection ' + socketId + ' from ' + clientIp);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});



server.listen(port, () => console.log(`Listening on port ${port}`));


