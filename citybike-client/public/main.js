//alert("main.js");
// http://localhost:4001 es en donde el servidor esta corriendo.

var socket = io.connect('http://localhost:8080', { 'forceNew': true });

socket.on('messages', function(data){//cuando reciba el eveto messages, ejecuta esta fun
	//console.log("print message");
	//console.log(data);
	alert("!");
});


function reder(data){

	var html = `<div>${  }</div>`

}