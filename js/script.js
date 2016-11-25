/*
posX: position of row
posY: posição of column
content: content of the specific fiel - B = bomb; E = empty; 0-8 = number of bombs around
flag: help flag - B = bomb; E = empty; U = undefined

*/

$(document).ready(function() {
	var rowN = 5, columnN = 5, bombs = 10;

	generateMatrix(rowN,columnN,bombs);
});

generateMatrix = function(rowN, columnN, bombs){

	//initialize an empty matrix based on row and column numbers
	var field = new Array(rowN);
	for(var i = 0; i < rowN; i++){
		field[i] = new Array(columnN);
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
	//sets each value of the field
	for(var i = 0; i < rowN; i++){
		for(var j = 0; j < columnN; j++){

			var cnt = 'E';
			//if the current position is a bomb, set 'content' as 'B'
			if(posBombs.indexOf(count) >= 0){
				cnt = 'B';
				posBombs.pop(count);
			}
			
			field[i][j] = {id: count, posX: i, posY: j, content: cnt, flag: 'E', revealed: false};

			count++;
		}
	}

	//analize and sets the numbers around the bombs fields
	//for each value of field...
	for(var i = 0; i < rowN; i++){
		for(var j = 0; j < columnN; j++){
			var x = field[i][j].posX -1;
			var y = field[i][j].posY -1;

			if(field[i][j].content !== 'B'){
				var countBomb = 0;

				//count the number of bombs around the field
				//for each field around the current field
				for(var k = x; k < (x+3); k++){
					for(var l = y; l < (y+3); l++){
						//check the borders
						if(k >= 0 && l >= 0 && k < rowN && l < columnN){
							if(field[k][l].content === 'B'){
								countBomb++;
							}
						}
					}
				}

				field[i][j].content = countBomb;
			}
		}
	}

	console.log(field);

};