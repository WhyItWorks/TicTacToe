var express = require('express');
var app = express();
var path = require('path');

var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 9100;
var maxUsers = 2;
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

    console.log('user connected to room: ' + room);

    
    console.log('actualRoom: ' + room + ' - Current users: ' + currentUsers);
    
    
    playerIDArray.push(socket.id);  // <- Este array contiene la información obtenida hasta el momento    
    socket.emit('symbol', symbols[currentUsers - 1], playerIDArray);

    console.log('Assigning symbol: [' + symbols[currentUsers - 1] + '] to player');
    currentUsers++;


    socket.on('disconnect', function () {
        io.emit('redirect', '/');
        console.log('user disconnected to room: ' + room);
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
    console.log('listening on *:' + port);
});