const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const citybikeurl = "http://api.citybik.es/v2/networks/decobike-miami-beach"
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

 //Se establece el intervalo  en 6000 ms 
  interval = setInterval(() => obtenerApi(socket), 6000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Se obtiene la informacion de la Api
const obtenerApi = async socket => {

  try {
    const mensaje  = await axios.get(citybikeurl);  
    socket.emit("cityBici", mensaje.data)   
    //console.log(mensaje.data.network.stations)

  } catch (error) {

    console.error(`Errorr : ${error.code}`);
  }
};



server.listen(port, () => console.log(`Listening on port ${port}`));



