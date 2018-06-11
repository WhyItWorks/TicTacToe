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
    winnersArray = new Array(); // Arreglo que contiene todas las jugadas ganadoras
    player1Plays = new Array();
    player2Plays = new Array();
    playSize = 3;

    playerPlays = new Array();
    player1ID = null;
    player2ID = null;
    jugadorActual = null;

    gameWinner = false;
    myPlayData = new Array();
    var turn = 0;
  



    var arr = new Array(3)
    var checkResult = function () {
        for (i = 0; i < 3; i++) {
            arr[i] = new Array(3)
        }
        console.log(arr);

        $(".tr").each(function (i, val) {
            $(this).find('p').each(function (j, val2) {
                arr[i][j] = parseInt($(this).attr("data-points"));
            });
        });


        for (var i = 0; i < 3; i++) {
            var rowSum = 0;
            for (var j = 0; j < 3; j++) {
                rowSum += arr[i][j];
            }
            if (rowSum === 3) {
                $('#message').text('Ganador: O')
                $('#resulMessageModal').modal('toggle');
            } else if (rowSum === -3) {
                $('#message').text('Ganador: X')
                $('#resulMessageModal').modal('toggle');
            }
        }

        for (var i = 0; i < 3; i++) {
            var colSum = 0;
            for (var j = 0; j < 3; j++) {
                colSum += arr[j][i];
            }
            if (colSum === 3) {
                $('#message').text('Ganador: O')
                $('#resulMessageModal').modal('toggle');
            } else if (colSum === -3) {
                $('#message').text('Ganador: X')
                $('#resulMessageModal').modal('toggle');
            }
        }

        if (arr[0][0] + arr[1][1] + arr[2][2] === 3) {
            $('#message').text('Ganador: O')
            $('#resulMessageModal').modal('toggle');
        } else if (arr[0][0] + arr[1][1] + arr[2][2] === -3) {
            $('#message').text('Ganador: X')
            $('#resulMessageModal').modal('toggle');
        }

        if (arr[2][0] + arr[1][1] + arr[0][2] === 3) {
            $('#message').text('Ganador: O')
            $('#resulMessageModal').modal('toggle');
        } else if (arr[2][0] + arr[1][1] + arr[0][2] === -3) {
            $('#message').text('Ganador: X')
            $('#resulMessageModal').modal('toggle');
        }

    };






    socket.on('symbol', function (msg, idArray, room) {

        $CurrentRoom = room;
        $Marca = msg;

        console.log('CurrentRoom: ' + $CurrentRoom)
        $('#marca').text($Marca)

        player1ID = idArray[0].slice(idArray[0].length - 1);
        player1ID = player1ID.charCodeAt(0);

        if (idArray[1] != null) {
            player2ID = idArray[1].slice(idArray[1].length - 1);
            player2ID = player2ID.charCodeAt(0);
        }

        console.log(player1ID + '--' + player2ID);

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

    function avoidOverwriting(Cell) {
        if ($CellP.text() === "") {
            return true;
        } else {
            return false;
        }
    }

    $('.cell').click(function (e) {

        $CellP = $(this).children('p');


        if ($Marca == 'O') {
            $CellP.attr("data-points", 1);
            turn = 1;
        } else {
            $CellP.attr("data-points", -1);
            turn = 0;
        }
        checkResult();


        $Correcto = avoidOverwriting($CellP);

        if ($Correcto) {
            if (onThePlay) {

                $CellP.text($Marca);
                index = $('.cell').index(this);
                playData = play(index);

                if (playData.index === index) {
                    socket.emit('play', JSON.stringify(playData));
                    drawPlay(playData);
                    onThePlay = false;
                }
            } else {
                message = "¡Esperando al otro jugador!";
                Alert('.alert-info', message);
            }
        }

    });


    socket.on('redirect', function (destination, room) {

        console.log(room + '--' + $CurrentRoom);

        if (room == $CurrentRoom) {
            window.location.href = destination;
        }



    });

    function Alert(__class, mensaje) {

        $Alert = $(__class);
        $Alert.text(message).show(0).effect("shake").delay(500).queue(function (next) {
            $Alert.hide(0);
            next();
        });
    }


});