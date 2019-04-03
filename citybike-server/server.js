const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const citybikeurl = "http://api.citybik.es/v2/networks/decobike-miami-beach"  // Api que provee la información sobre las bicicletas

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();

app.use(index);

const server = http.createServer(app);
const io = socketIo(server); 
let interval;


// Conectamos con el socket
io.on("connection", socket => {

  var request = http.get(citybikeurl, function (response) {

    var buffer = "", data, route;

    response.on("data", function (chunk) {
        buffer += chunk;      // Cargamos la informacion de la api en el buffer
    });

    response.on("end", function (err) {

        data = JSON.parse(buffer);        // Pasamos a Json la informacion de la api
        io.emit('location', data['network']['location']);     // Le emitimos al cliente (React) las locaciones y las estaciones
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


