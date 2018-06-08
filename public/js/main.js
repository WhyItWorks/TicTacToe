$(document).ready(function () {



    $reloadDiv = $('#reload');

    $reloadDiv.hover(function () {
        $('#reload svg').addClass('fa-spin');
    }, function () {
        $('#reload svg').removeClass('fa-spin');
    });


    //Socket
    var socket = io();
    var playlist = new Array(9); //Tablero 
    var coordinates = null; //Coordenadas de juego
    var index = null; //Indice donde se realizó la marca
    var onThePlay = false; //Turno activo -> Evitar doble turno 

    socket.on('symbol', function (msg) {
        $Marca = msg;
        $('#marca').text($Marca)
        if ($Marca === 'O') {
            onThePlay = true;
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

        $('.cell').children('p').eq(playData.index).text(playData.symbol);
        coordinates = getPlayCoordinates(playData.index);
    }

    function getPlayCoordinates(index) {
        var x = Math.floor((index) / 3) + 1;
        var y = index - (x - 1) * 3 + 1;
        return {
            x: x,
            y: y
        };

    }

    function play(index) {
        coordinates = getPlayCoordinates(index);
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

            if (onThePlay) {

                $CellP.text($Marca);

                index = $('.cell').index(this);
                var playData = play(index);

                if (playData.index === index) {
                    socket.emit('play', JSON.stringify(playData));
                    onThePlay = false;
                }
            } else {
                message = "¡Esperando al otro jugador!";
                Alert('.alert-info', message);
            }
        }
    });



    socket.on('redirect', function (destination) {
        // message = "El otro jugador se ha desconectado";
        // Alert('.alert-danger', message)
        window.location.href = destination;

    });

    function Alert(__class, mensaje) {

        $Alert = $(__class);
        $Alert.text(message).show(0).effect("shake").delay(500).queue(function (next) {
            $Alert.hide(0);
            next();
        });
    }


});