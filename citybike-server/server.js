const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const port = process.env.PORT || 4001;
const index = require('./routes/index');
const app = express();

app.use(index);

const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
let interval;

const fetchMiamiStations = async socket => {
    try {
        const res = await axios.get(
            'http://api.citybik.es/v2/networks/decobike-miami-beach'
        );
        socket.emit('MiamiStations', res.data.network.stations);
    } catch(error) {
        console.error(`Error: ${error.code}`);
    }
};

io.on('connection', socket => {
    let socketId = socket.id;
    let clientIp = socket.request.connection.remoteAddress;
    console.log(`New connection ${socketId} from ${clientIp}`);

    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(
        () => fetchMiamiStations(socket),
        1000
    );
    socket.on(
        'disconnect',
        () => {
            console.log(`Client disconnected`);
        }
    );
});

server.listen(
    port,
    () => console.log(`Listening on port ${port}`)
);
