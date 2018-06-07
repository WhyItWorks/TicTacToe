var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 9100;
var maxUsers = 2;
var currentUsers = 0;
var symbols = ['X', 'O'];
var playlist = new Array(9);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

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
        var playData = JSON.parse(message);
        playlist[playData.index] = playData.symbol;
    });
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});
