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

    winnersArray = new Array();
    player1Plays = new Array();
    player2Plays = new Array();
    playSize = 3;
    playerPlays = new Array();
    player1ID = null;
    player2ID = null;
    jugadorActual = null;

    gameWinner = false;

    function cargaSoluciones() {
        winnersArray.push([0, 1, 2]);
        winnersArray.push([3, 4, 5]);
        winnersArray.push([6, 7, 8]);
        winnersArray.push([0, 3, 6]);
        winnersArray.push([1, 4, 7]);
        winnersArray.push([2, 5, 8]);
        winnersArray.push([0, 4, 8]);
        winnersArray.push([6, 4, 2]);
    }


    function revisarGanador() {

        if (player1ID % 2 != 0) {
            playerPlays = player1Plays;
        } else if (player2ID % 2 == 0) {
            playerPlays = player2Plays;
        }


        if (!jugadorActual) {
            playerPlays = player1Plays;
        } else {
            playerPlays = player2Plays;
        }

        if (playerPlays.length >= playSize) {
            for (var i = 0; i < winnersArray.length; i++) {
                var findWinnerSet = winnersArray[i];
                var winnerSetFound = true;

                for (var j = 0; j < winnersArray.length; j++) {
                    var foundWinner = false;

                    for (var k = 0; k < playerPlays.length; k++) {
                        if (findWinnerSet[j] == playerPlays[k]) {
                            foundWinner = true;
                            break;
                        }
                    }

                    if (foundWinner == false) {
                        winnerSetFound = false;
                        break;
                    }
                }

                if (winnerSetFound == true) {
                    gameWinner = true;
                    break;
                }
            }
        }

        return gameWinner;
    }

    socket.on('symbol', function (msg, idArray) {
        $Marca = msg;
        $('#marca').text($Marca)

        player1ID = idArray[0].slice(idArray[0].length - 1);
        player1ID = player1ID.charCodeAt(0);

        //PROBLEMA !!
        //Solo envía los datos una vez por conexión 
        //Al usuario 1, solo le envía la información que existe hasta ese momento (id usuario 1)
        //Al usuario 2, le envía toda la infomación
        if (idArray[1] != null) {
            player2ID = idArray[1].slice(idArray[1].length - 1);
            player2ID = player2ID.charCodeAt(0);
        }

        console.log(player1ID + '--' + player2ID);

        if ($Marca == 'O') {
            jugadorActual = player1ID;
        } else {
            jugadorActual = player2ID;
        }


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
        console.log(playData)
        playlist[playData.index] = playData.symbol;

        indexArray = playData.index

        playerPlays.push(indexArray);

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

        revisarGanador();
        cargaSoluciones();        
    });


    socket.on('redirect', function (destination) {
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