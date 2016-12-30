/*
posX: position of row
posY: posição of column
content: content of the specific fiel - B = bomb; E = empty; 0-8 = number of bombs around
flag: help flag - B = bomb; E = empty; U = undefined
difficult: name = number: n / size row/column / bombs: n
    easy = number: 0 / size: 15x10 / bombs: 10
    medium = number: 1 / size: 20x30 / bombs: 75
    hard = number: 2 / size: 30x45 / bombs: 175

*/

angular.module('appMinesweeper', []);

angular.module("appMinesweeper").controller('MainController', ['$scope', function ($scope) {

    $scope.field;

    $scope.rowN = 0;
    $scope.columnN = 0;
    $scope.bombs = 0;

    var firstTime = true;

    $scope.gameControl = {bombs: $scope.bombs, difficult: 0};

    $scope.defineDifficult = function(difficult){
        console.log('Vai definir');
        if(difficult === 0){
            $scope.rowN = 15;
            $scope.columnN = 10;
            $scope.bombs = 10;
            $scope.gameControl.difficult = difficult;
            $scope.gameControl.bombs = $scope.bombs;
        } else if(difficult === 1){
            $scope.rowN = 20;
            $scope.columnN = 30;
            $scope.bombs = 75;
            $scope.gameControl.difficult = difficult;
            $scope.gameControl.bombs = $scope.bombs;
        } else if(difficult === 2){
            $scope.rowN = 30;
            $scope.columnN = 45;
            $scope.bombs = 175;
            $scope.gameControl.difficult = difficult;
            $scope.gameControl.bombs = $scope.bombs;
        } else if(difficult === 3){
            $scope.rowN = 20;
            $scope.columnN = 20;
            $scope.bombs = 75;
            $scope.gameControl.difficult = difficult;
            $scope.gameControl.bombs = $scope.bombs;
        }

        firstTime = true;

        $scope.generateFakeMatrix($scope.rowN,$scope.columnN);
    };

    $scope.handleClick = function(evt,square) {
        if(((evt.which == 1 || evt.which == 3) && square.revealed) || (evt.which == 2 && !square.revealed) || (firstTime && (evt.which == 2 || evt.which == 3)) || (square.flag === 'B' && evt.which == 1)){
            return false;
        }

        if(firstTime){
            var x = square.posX;
            var y = square.posY;

            $scope.generateMatrix($scope.rowN,$scope.columnN,$scope.bombs,square);
            square = $scope.field[x][y];
            //$scope.leftButtonClick($scope.field[x][y]);
        }
        switch(evt.which) {
            case 1:
                $scope.leftButtonClick(square);
                if(firstTime){
                    firstTime = false;
                }
            break;
            case 2:
                $scope.middleButtonClick(square);
            break;
            case 3:
                $scope.rightButtonClick(square);
            break;
            default:
            alert("you have a strange mouse");
            break
        }  
    };

    $scope.rightButtonClick = function(square){
        if(square.flag === 'E'){
            $scope.gameControl.bombs--;
            square.flag = 'B';
            square.sprite_u = "img/ms_u_B.png";
            if($scope.gameControl.bombs == 0){

            }
        } else if(square.flag === 'B'){
            $scope.gameControl.bombs++;
            square.flag = 'U';
            square.sprite_u = "img/ms_u_U.png";
        } else if(square.flag === 'U'){
            square.flag = 'E';
            square.sprite_u = "img/ms_u_E.png";
        }
    };

    $scope.leftButtonClick = function(square){
        //$scope.field[square.posX][square.posY].revealed = true;
        square.revealed = true;
        if(square.content === 'B'){
            square.sprite_r = "img/ms_r_FB.png";
            $scope.revealAll();
            alert('Game Over');
        } else if(square.content === 0){
            $scope.spread(square);
        }
    };

    $scope.middleButtonClick = function(square){
        if(square.content === 'B' || square.content === 0){
            return false;
        } else{
            $scope.revealBox(square);
        }
    };

    $scope.verifyVictory = function(){
        var countBomb = 0;

        for(var i = 0; i < $scope.rowN; i++){
            for(var j = 0; j < $scope.columnN; j++){
                if($scope.field[i][j].content === 'B' && $scope.field[i][j].flag === 'B'){
                    countBomb++;
                }
            };
        };

        if(countBomb == $scope.bombs){
            for(var i = 0; i < $scope.rowN; i++){
                for(var j = 0; j < $scope.columnN; j++){
                    if($scope.field[i][j].content !== 'B'){
                        $scope.field[i][j].revealed = true;
                    }
                };
            };
            alert('Congratulations champz! Cê é o bixão mesmo ;)');
        }
    };

    $scope.revealAll = function(){
        for(var i = 0; i < $scope.rowN; i++){
            for(var j = 0; j < $scope.columnN; j++){
                if($scope.field[i][j].content !== 'B' && $scope.field[i][j].flag === 'B'){
                    $scope.field[i][j].sprite_r = 'img/ms_r_WB.png';
                }

                $scope.field[i][j].revealed = true;
            };
        };
    };

    $scope.revealBox = function(square){
        var countBomb = 0;
        var x = square.posX -1;
        var y = square.posY -1;

        for(var k = x; k < (x+3); k++){
            for(var l = y; l < (y+3); l++){
                //check the borders
                if(k >= 0 && l >= 0 && k < $scope.rowN && l < $scope.columnN){
                    if($scope.field[k][l].flag === 'B'){
                        countBomb++;
                    }
                }
            }
        }

        if(countBomb === square.content){
            for(var k = x; k < (x+3); k++){
                for(var l = y; l < (y+3); l++){
                    //check the borders
                    if(k >= 0 && l >= 0 && k < $scope.rowN && l < $scope.columnN){
                        if(!$scope.field[k][l].revealed && $scope.field[k][l].flag != 'B'){
                            $scope.leftButtonClick($scope.field[k][l]);
                        }
                    }
                }
            }
        }
    };



    $scope.spread = function(square){
        square.revealed = true;

        if(square.content > 0){
            return false;
        }

        if(square.posX > 0 && $scope.field[square.posX -1][square.posY].revealed === false && $scope.field[square.posX -1][square.posY].content >= 0){
            $scope.spread($scope.field[square.posX -1][square.posY]);
        } 
        if(square.posY > 0 && $scope.field[square.posX][square.posY - 1].revealed === false && $scope.field[square.posX][square.posY - 1].content >= 0){
            $scope.spread($scope.field[square.posX][square.posY - 1]);
        }
        if(square.posX < $scope.columnN-1 && $scope.field[square.posX + 1][square.posY].revealed === false && $scope.field[square.posX + 1][square.posY].content >= 0){
            $scope.spread($scope.field[square.posX + 1][square.posY]);
        } 
        if(square.posY < $scope.rowN-1 && $scope.field[square.posX][square.posY + 1].revealed === false && $scope.field[square.posX][square.posY + 1].content >= 0){
            $scope.spread($scope.field[square.posX][square.posY + 1]);
        }

        return false;
    };

    $scope.generateFakeMatrix = function(rowN,columnN){
        $scope.field = new Array(rowN);
        for(var i = 0; i < rowN; i++){
            $scope.field[i] = new Array(columnN);
        }

        var count = 0;
        //sets each value of the $scope.field
        for(var i = 0; i < rowN; i++){
            for(var j = 0; j < columnN; j++){

                
                $scope.field[i][j] = {id: count, posX: i, posY: j, content: 0, flag: 'E', revealed: false, sprite_r: "img/ms_r_0.png", sprite_u: "img/ms_u_E.png"};

                count++;
            }
        }
    };

    $scope.generateMatrix = function(rowN,columnN,bombs,firstSquare){
        //initialize an empty matrix based on row and column numbers
        $scope.field = new Array(rowN);
        for(var i = 0; i < rowN; i++){
            $scope.field[i] = new Array(columnN);
        }

        var posBombs = [];
        //pre-define the position of each bomb and store in an array
        for(var i = 0; i < bombs; i++){
            var random;
            do{
                random = Math.floor((Math.random() * (rowN * columnN)) + 0);
            } while(posBombs.indexOf(random) >= 0 || random == firstSquare.id);
            
            posBombs.push(random);
        }

        console.log(posBombs);

        var count = 0;
        //sets each value of the $scope.field
        for(var i = 0; i < rowN; i++){
            for(var j = 0; j < columnN; j++){
                var rev = false;

                /*if(count == firstSquare.id){
                    rev = true;
                }*/

                var cnt = 'E';
                //if the current position is a bomb, set 'content' as 'B'
                if(posBombs.indexOf(count) >= 0){
                    cnt = 'B';
                    //posBombs.pop(count);
                }
                
                $scope.field[i][j] = {id: count, posX: i, posY: j, content: cnt, flag: 'E', revealed: rev, sprite_r: "", sprite_u: "img/ms_u_E.png"};

                count++;
            }
        }

        //analize and sets the numbers around the bombs fields
        //for each value of $scope.field...
        for(var i = 0; i < rowN; i++){
            for(var j = 0; j < columnN; j++){
                var x = $scope.field[i][j].posX -1;
                var y = $scope.field[i][j].posY -1;

                if($scope.field[i][j].content !== 'B'){
                    var countBomb = 0;

                    //count the number of bombs around the $scope.field
                    //for each $scope.field around the current $scope.field
                    for(var k = x; k < (x+3); k++){
                        for(var l = y; l < (y+3); l++){
                            //check the borders
                            if(k >= 0 && l >= 0 && k < rowN && l < columnN){
                                if($scope.field[k][l].content === 'B'){
                                    countBomb++;
                                }
                            }
                        }
                    }

                    $scope.field[i][j].content = countBomb;
                }
                $scope.field[i][j].sprite_r = "img/ms_r_" + $scope.field[i][j].content + ".png";
            }
        }

        console.log($scope.field);
    };

    //$scope.generateMatrix($scope.rowN,$scope.columnN,$scope.bombs);
    $scope.defineDifficult(3);
    
}]);