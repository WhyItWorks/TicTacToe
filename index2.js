//Script de backend, maneja el servidor para Tic-Tac-Toe

//Se llama a express para manejar el web framework
var app = require('express')();
//Se llama a http para que la página funcione sobre el servidor, en este caso Node
var http = require('http').Server(app);
//Se llama a io para el manejo de sockets
var io = require('socket.io')(http);
//Se designa un puerto de conexión arbitrario
var port = process.env.PORT || 9100;
//Variable para definir un número máximo de jugadores
var maxUsers = 2;
//Variable para definir la cantidad de jugadores conectados
var currentUsers = 0;
//Variable para definir los símbolos de juego, en un arreglo
var symbols = ['X', 'O'];
//Variable para revisar la ubicación de las marcas dentro de un arreglo
var playlist = new Array(9);

//Función que envía un index.html cuando se hace un request a conectarse al servicio, utiliza el namespace por defecto
app.get('/', function (request, response) {
    //En este caso se envía un archivo index.html dentro de la raíz
    response.sendFile(__dirname + '/index.html');
});

//Función que define una acción al momento de conexión por socket
io.on('connection', function (socket) {
    //Imprime un mensaje en consola para verificar la conexión
    console.log('a user connected');
    //Condición para no asignar símbolos cuando existen más de 2 personas conectadas
    if (currentUsers < maxUsers) {
        //Se envía al frontend el símbolo asignado al jugador junto con el número del jugador
        socket.emit('symbol', symbols[currentUsers]);
        //Se imprime en consola el símbolo asignado al jugador
        console.log('Assigning symbol: [' + symbols[currentUsers] + '] to player')
        //Se aumenta la cantidad de jugadores actuales
        currentUsers++;
    }

    //Se envía el inicio del juego hacia el frontend
    socket.on('play', function (message) {
        //Se imprime el mensaje en consola dependiendo de lo que apunte el frontend
        console.log(message);
        //Se emite el evento play hacia el frontend junto con el mensaje
        io.emit('play', message);
        //Se crea una variable para mostrar los mensajes de juego en la página
        var playData = JSON.parse(message);
        //Se revisa el lugar de la jugada para asignarlo a un índice en el arreglo playlist
        playlist[playData.index] = playData.symbol;
    });
});

//Función para imprimir un mensaje donde se indica el puerto que está escuchando
http.listen(port, function () {
    console.log('listening on *:' + port);
});
