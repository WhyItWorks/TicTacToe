$(document).ready(function () {



    $reloadDiv = $('#reload');

    $reloadDiv.hover(function () {
        $('#reload svg').addClass('fa-spin');
    }, function () {
        $('#reload svg').removeClass('fa-spin');
    });



    //Socket
    var socket = io();
    var playlist = new Array(9);
    var coordinates = null;
    var index = null;

    socket.on('symbol', function (msg) {
        $Marca = msg;
        $('#marca').text($Marca)
        if ($Marca === 'O') {
            onThePlay = true;

        } else {

        }
    })

    socket.on('play', function (msg) {
        try {
            var playData = JSON.parse(msg);
            if (playData.symbol !== $Marca) {
                onThePlay = true;
            }
            drawPlay(playData);
        } catch (e) {
            console.log(e.msg);
        }
    });

    function drawPlay(playData) {
        playlist[playData.index] = playData.symbol;

        $(this).children('p').eq(playData.index).text(playData.symbol);

        //Se declara una variable de coordinadas para guardar el índice, dentro del arreglo, de la jugada
        coordinates = getPlayCoordinates(playData.index);
        //Llama a la función logPlay para indicar el símbolo jugado en la coordinada indicada
        // logPlay('player [' + playData.symbol + '] play: [' + coordinates.x + '][' + coordinates.y + ']');
    }

    // function logPlay(message) {
    //     var playLog = $('#play-log');
    //     // playLog.html(playLog.html() + '<br/>' + message);
    // }

    function getPlayCoordinates(index) {
        var x = Math.floor((index) / 3) + 1;
        var y = index - (x - 1) * 3 + 1;
        return {
            x: x,
            y: y
        };

    }

    function play(index) {
        //Condición para validar si una celda está ocupada por una jugada anterior
        console.log('index: ' + index);
        //Se declara una variable para guardar un índice
        coordinates = getPlayCoordinates(index);
        console.log('play position: [' + coordinates.x + '][' + coordinates.y + ']');
        return {
            symbol: $Marca,
            index: index
        };
    }

    function evitarSobreescritura(Cell) {
        if ($CellP.text() === "") {
            return true;
        } else {
            return false;
        }
    }


    $('.cell').click(function (e) {
        $Correcto = true;
        $CellP = $(this).children('p');

        $Correcto = evitarSobreescritura($CellP);

        if ($Correcto) {
            $CellP.text($Marca);

            index = $('.cell').index(this);

            var playData = play(index);

            if (playData.index === index) {
                socket.emit('play', JSON.stringify(playData));
            }
        }






    });


});