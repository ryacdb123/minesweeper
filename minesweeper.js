function make2DArray(cols, rows){
	var arr = new Array(cols);

	for(var i = 0; i < arr.length; i++){
		arr[i] = new Array(rows);
	}
	return arr;
}
var noBees = 0;
var totalBees = 80;

function Cell(x, y, w, h){

	this.bee = false;

	this.revealed = false;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h =h;
	this.i = this.x / this.w;
	this.j = this.y / this.w;
	this.total = 0;

	this.countBees = function(){
		var total = 0;
		if(this.bee){
			this.total = -1;
		}

		for(var xoff = -1; xoff <= 1; xoff++){
			for(var yoff =-1; yoff <= 1; yoff++){
				var i = this.i + xoff;
				var j = this.j + yoff;

				if(i > -1 && i < cols && j > -1 && j < rows){
					var neighbor = grid[i][j];
					if(neighbor.bee){
						total++;
					}	
				}
				

			}
		}
		this.total = total;

	}

	this.show = function(){

		if(!this.revealed)
		stroke(0);
		noFill();
		rect(this.x, this.y, this.w, this.w);

		if(this.revealed){
			if(this.bee){
				stroke(0);
				fill(126);
				ellipse(this.x + (w/2), this.y + (w/2), this.w * 0.5);
			} else{
				noStroke();
				fill(127);
				
				rect(this.x + 1.5, this.y + 1.5, this.w - 2, this.w - 2);
				fill(0);
				//textAlign(CENTER);
				
					text(this.total, this.x + w/3, this.y + w/1.5);
				
			}
		}
	}

	this.contains = function(x, y){
		return(x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w);
	}
	this.setRevealed = function(){
		this.revealed = true;

		if(this.total == 0){
			//flood fill time
			this.floodFill();
		}
	}

	this.floodFill = function(){
		for(var xoff = -1; xoff <= 1; xoff++){
			for(var yoff =-1; yoff <= 1; yoff++){
				var i = this.i + xoff;
				var j = this.j + yoff;

				if(i > -1 && i < cols && j > -1 && j < rows){
					var neighbor = grid[i][j];
					if(!neighbor.bee && !neighbor.revealed){
						neighbor.setRevealed;
					}	
				}
				

			}
		}
	}

}

var grid;
var canvasWidth = 400;
var canvasHeight = 400;
var w = 20;
var cols = canvasWidth/w;
var rows = canvasHeight /w; 

function setup(){
	createCanvas(canvasWidth + 1, canvasHeight+ 1);

	grid = make2DArray(cols, rows);

	for(var i = 0; i < cols; i++){
		for(var j = 0; j < rows; j++){
			grid[i][j] = new Cell(i * w , j * w , w);
		}
	}

	var options = [];
	for(var i = 0; i < cols; i++){
		for(var j = 0; j < rows; j++){
			options.push([i, j]);
			//console.log(options);
		}
	}

	for(var n = 0; n < totalBees; n++){
		var index = floor(random(options.length));
		var choice = options[index];
		var i = choice[0];
		var j = choice[1];

		options.splice(index, 1);
		grid[i][j].bee = true;
		

	}

	for(var i = 0; i < cols; i++){
		for(var j = 0; j < rows; j++){
			grid[i][j].countBees();
		}
	}
}

function draw(){
	background(255);
	for(var i = 0; i < cols; i++){
		for(var j = 0; j < rows; j++){
			grid[i][j].show();
		}
	}

}
function gameOver(){
	for(var i = 0; i < cols; i++){
		for(var j = 0; j < rows; j++){
			grid[i][j].revealed = true;
		}
	}
}

function mousePressed(){
	for(var i = 0; i < cols; i++){
		for(var j = 0; j < rows; j++){
			if(grid[i][j].contains(mouseX, mouseY)){
				grid[i][j].setRevealed();


				if(grid[i][j].bee){
					gameOver();
				}
			}
		}
	}
}