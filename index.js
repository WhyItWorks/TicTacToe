var express = require('express');
var app = express();
var path = require('path');

var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 9100;
var currentUsers = 1;
var symbols = ['O', 'X'];
var playlist = new Array(9);
var room = 0;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/main.html');
});
app.get('/game', function (req, res) {
    res.sendFile(__dirname + '/game.html');
});

app.use('/public', express.static(__dirname + '/public'));


playerIDArray = new Array(2);
io.on('connection', function (socket) {


    //Si el numero de usuarios activos (currentUsers) sin room es 1, crea una nueva room
    if (currentUsers % 2 != 0) {
        socket.join('room-' + ++room);
        playerIDArray = [];
        currentUsers = 1;
    } else {
        // Si el numero de usuarios activos (currentUsers) sin room es 2, se une a una room donde esté solo 1 usuario
        socket.join('room-' + room);
    }

    var CurrentRoom = 'room-' + room;

    playerIDArray.push(socket.id); // <- Este array contiene la información obtenida hasta el momento    
    socket.emit('symbol', symbols[currentUsers - 1], playerIDArray, CurrentRoom);

    console.log('Se ha conectado un usuario en la room: room-' + room);
    console.log('Room actual: ' + CurrentRoom + ' - Cantidad de usuarios: ' + currentUsers);
    console.log('Asignando un simbolo: [' + symbols[currentUsers - 1] + ']');

    currentUsers++;


    socket.on('disconnect', function () {
        io.emit('redirect', '/', CurrentRoom);
        socket.leave(CurrentRoom);
        console.log('Se ha desconectado un usuario en la room: room-' + CurrentRoom);

        //Si un usuario se desconecta, la room queda inutilizable (para evitar que al recargar la pagina, se cree un jugador X solitario)
        currentUsers = 1;
    });

    socket.on('play', function (msg) {
        console.log(msg);
        io.emit('play', msg);
        var playData = JSON.parse(msg);

        playlist[playData.index] = playData.symbol;
    });
});

http.listen(port, function () {
    console.log('Escuchando el puerto : ' + port);
});