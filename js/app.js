/*
posX: position of row
posY: posição of column
content: content of the specific fiel - B = bomb; E = empty; 0-8 = number of bombs around
flag: help flag - B = bomb; E = empty; U = undefined

*/

angular.module('appMinesweeper', []);

angular.module("appMinesweeper").controller('MainController', ['$scope', function ($scope) {

    $scope.field;

    $scope.rowN = 10;
    $scope.columnN = 10;
    $scope.bombs = 20;


    $scope.handleClick = function(evt,square) {
        if(square.revealed){
            return false;
        };
        console.log(evt);
        console.log(square);
        switch(evt.which) {
            case 1:
            $scope.leftButtonClick(square);
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
        console.log('Right Mouse button pressed.');
    };

    $scope.leftButtonClick = function(square){
        console.log('Left Mouse button pressed.');
        $scope.field[square.posX][square.posY].revealed = true;
        if(square.content === 'B'){
            alert('Game Over');
        } else if(square.content === 'N'){

        } else {

        }
    };

    $scope.middleButtonClick = function(square){
        console.log('Middle Mouse button pressed.');
    };

    $scope.generateMatrix = function(rowN,columnN,bombs){
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
            } while(posBombs.indexOf(random) >= 0);
            
            posBombs.push(random);
        }

        console.log(posBombs);

        var count = 0;
        //sets each value of the $scope.field
        for(var i = 0; i < rowN; i++){
            for(var j = 0; j < columnN; j++){

                var cnt = 'E';
                //if the current position is a bomb, set 'content' as 'B'
                if(posBombs.indexOf(count) >= 0){
                    cnt = 'B';
                    posBombs.pop(count);
                }
                
                $scope.field[i][j] = {id: count, posX: i, posY: j, content: cnt, flag: 'E', revealed: false, sprite: ""};

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
                $scope.field[i][j].sprite = "img/ms_" + $scope.field[i][j].content + ".png";
            }
        }

        console.log($scope.field);
    };

    $scope.generateMatrix($scope.rowN,$scope.columnN,$scope.bombs);
    
}]);