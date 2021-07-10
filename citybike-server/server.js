const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");
const citybikeurl = "http://api.citybik.es/v2/networks/decobike-miami-beach"

const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();
app.use(index);
app.use("/statistics", (req, res) => {
  axios.get(citybikeurl).then(result => {    
    const topUsed = result.data.network.stations.map(x => ({name: x.name, id: x.id, free_bikes: x.free_bikes, empty_slots: x.empty_slots})).sort((a,b) => a.free_bikes - b.free_bikes).slice(0,4);
    const topEmpty = result.data.network.stations.map(x => ({name: x.name, id: x.id, free_bikes: x.free_bikes, empty_slots: x.empty_slots})).sort((a,b) => a.empty_slots - b.empty_slots).slice(0,4);    
    res.send({topUsedStations: topUsed, topEmptyStations: topEmpty}).status(200);
  }).catch(err => {
    console.log(err);
  });
});




const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
let interval;

let data = [];

io.on("connection", socket => {
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
  console.log('New connection ' + socketId + ' from ' + clientIp);

  socket.emit('initialData', data);

  socket.on("stationDamaged", (stationDamaged) => {
    data = data.filter(data.id !== stationDamaged.id).concat(stationDamaged);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


const loadInitialData = () => {
  console.log(`Listening on port ${port}`)
  console.log('Loading City bike data');
  axios.get(citybikeurl).then(result => {
    data = result.data.network.stations.map(x => ({lat: x.latitude, long: x.longitude, name: x.name, id: x.id, free_bikes: x.free_bikes, empty_slots: x.empty_slots, is_damaged: false}));
  }).catch(err => {
    console.log(err);
  })
}

server.listen(port, loadInitialData );



