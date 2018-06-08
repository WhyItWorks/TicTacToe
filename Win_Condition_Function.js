winnersArray = new Array();
player1Plays = new Array();
player2Plays = new Array();
playSize = 3;
playerPlays = new Array();
currentPlayer = 0;
gameWinner = false;

function cargaSoluciones(){
    winnersArray.push([0, 1, 2]);
    winnersArray.push([3, 4, 5]);
    winnersArray.push([6, 7, 8]);
    winnersArray.push([0, 3, 6]);
    winnersArray.push([1, 4, 7]);
    winnersArray.push([2, 5, 8]);
    winnersArray.push([0, 4, 8]);
    winnersArray.push([6, 4, 2]);
}

function revisarGanador(){
    if (currentPlayer == 0){
        playerPlays = player1Plays;
    }
    else{
        playerPlays = player2Plays;
    }
    
    if (playerPlays.length >= playSize){
        for (var i = 0; i < winnersArray.length; i++){
            var findWinnerSet = winnersArray[i];
            var winnerSetFound = true;
    
            for (var j = 0; j < winnersArray.length; j++){
                var foundWinner = false;
    
                for (var k = 0; k < playerPlays.length; k++){
                    if (findWinnerSet[j] == playerPlays[k]){
                        foundWinner = true;
                        break;
                    }
                }
    
                if (foundWinner == false){
                    winnerSetFound = false;
                    break;
                }
            }
    
            if (winnerSetFound == true){
                gameWinner = true;
                break;
            }
        }
    }
    
    return gameWinner;
}


