// Dependencias
const express = require("express");
const axios = require("axios")
const http = require("http");
const socketIo = require("socket.io");

// api
const citybikeurl = "http://api.citybik.es/v2/networks/decobike-miami-beach"

const port = process.env.PORT || 4001; //puerto a utilizar
const index = require("./routes/index"); //renderizar
const app = express(); // crea una apliacion express

app.use(index); // usar esta ruta

// Creacion de servidor y socket
const server = http.createServer(app); // instancia del http.server
const io = socketIo(server); //  socketio del server
let interval;

// Establecemos conexion del socket
io.on("connection", socket => {
	var socketId = socket.id;
	var clientIp = socket.request.connection.remoteAddress;

	console.log('New connection ' + socketId + ' from ' + clientIp); // conexion satisfactoria

	interval = setInterval( () => obtener_api_enviar(socket), 3000); // ejecutar la funcion cada 3000 milisegundos

	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});
});

// usando async/await
const obtener_api_enviar = async socket => {
	try {
		const res = await axios.get(citybikeurl); // api request (modo asincronico/espera)
		socket.emit('mensaje', res.data) // enviar a cliente
		//console.log(res.data.network.stations);
	} 
	catch (error) {
		console.error(`Errorrrrrrrr server: ${error.code}`);
	}
};

server.listen(port, () => console.log(`Listening on port ${port}`));