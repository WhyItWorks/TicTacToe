var express = require('express');
var app = express();
var path = require('path');

var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 9100;
var maxUsers = 2;
var currentUsers = 0;
var symbols = ['X', 'O'];
var playlist = new Array(9);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/main.html');
});
app.get('/game', function (req, res) {
    res.sendFile(__dirname + '/game.html');
});



app.use('/public', express.static(__dirname + '/public'));


io.on('connection', function (socket) {
    console.log('a user connected');
    if (currentUsers < maxUsers) {
        socket.emit('symbol', symbols[currentUsers]);
        console.log('Assigning symbol: [' + symbols[currentUsers] + '] to player')
        currentUsers++;


    }

    socket.on('play', function (msg) {
        console.log(msg);
        io.emit('play', msg);
        if (currentUsers <= 2) {
            var playData = JSON.parse(msg);
            playlist[playData.index] = playData.symbol;
        }
    });
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});