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
let interval = 5000;

io.on("connection", socket => {
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
  console.log('New connection ' + socketId + ' from ' + clientIp);
  
  setInterval(() => {
    http.get(citybikeurl, (response) => {
      var data = Buffer.alloc(0);

      response.on('data', (dataChunk) => {
        data = Buffer.concat([data, dataChunk]);
      })

      response.on('end', () => {
        data = JSON.parse(data.toString());
        console.log(`---\nCityBike response status code: ${response.statusCode}`)
        console.log(`Location: ${data.network.location.city}`);
        console.log(`Number of stations: ${data.network.stations.length}`);

        io.emit('location', data.network.location);
        io.emit('stations', data.network.stations);
      });

    }).on('error', (error) => {
      console.log(error);
    }).end();
  }, interval);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


server.listen(port, () => console.log(`Listening on port ${port}`));