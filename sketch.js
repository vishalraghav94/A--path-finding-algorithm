var rows = 45;
var cols = 45;
var grid = new Array(rows);
var i, j;
var openSet = [];
var closedSet = [];
var start, end;
var w, h;
var current;
var path = [];
function heuristic (a, b) {
    var d = dist(a.x, a.y, b.x, b.y);
    return d;
}
function Spot(x, y) {
    this.x = x;
    this.y = y;
    this.f = Infinity;
    this.neighbours = [];
    this.g = Infinity;
    this.h = 0;
    this.cameFrom = undefined;
    this.obstacle = false;
    if (random(1) < 0.4) {
        this.obstacle = true;
    }
    this.show = function (color) {
        if (this.obstacle) {
            color = "black";
            fill(color);
            noStroke();
            ellipse(this.x * w + w / 2, this.y * h + h / 2, w / 2, h / 2);
        }
       // fill(color);
        //noStroke();
       // rect(this.x * w, this.y * h, w - 1 , h - 1);
    };
    this.addNeighbours = function (grid) {
        var i = this.x;
        var j = this.y;
        if (j < cols - 1) {
            this.neighbours.push(grid[i][j + 1]);
        }
        if (i < rows - 1) {
            this.neighbours.push(grid[i + 1][j]);
        }
        if (i > 0) {
            this.neighbours.push(grid[i - 1][j]);
        }
        if (j > 0) {
            this.neighbours.push(grid[i][j - 1]);
        }
        if ((i < rows -1) && (j < cols - 1)) {
            this.neighbours.push(grid[i + 1][j + 1]);
        }
        if ((i > 0 ) && (j > 0)) {
            this.neighbours.push(grid[i - 1][j - 1]);
        }
        if ((i < rows -1) && (j > 0)) {
            this.neighbours.push(grid[i + 1][j - 1]);
        }
        if ((i > 0) && (j < cols - 1)) {
            this.neighbours.push(grid[i - 1][j + 1]);
        }
    }
}

function setup() {
    createCanvas(600,600);
    w = width / rows;
    h = height / cols;
    for(i = 0; i < cols; i++) {
        grid[i] = new Array(cols);
    }
    for(i = 0; i < rows; i++) {
        for(j = 0; j < cols; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }
    for(i = 0; i < rows; i++) {
        for(j = 0; j < cols; j++) {
            grid[i][j].addNeighbours(grid);
        }
    }
    start = grid[0][0];
    start.g = 0;
    start.obstacle = false;
    end = grid[rows - 1][cols - 1];
    end.obstacle = false;
    start.f = heuristic(start, end);
    openSet.push(start);
    //console.table(grid);
}
var temp, finalPath;
function draw() {
   // background(255);
    if (openSet.length > 0) {
        var lowestIndexF = 0;
        for (i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[lowestIndexF].f) {
                lowestIndexF = i;
            }
        }
        current = openSet[lowestIndexF];
        if (current === end) {
            finalPath = [];
            var tempNode = current;
            finalPath.push(tempNode);
            while (tempNode.cameFrom) {
                finalPath.push(tempNode);
                tempNode = tempNode.cameFrom;
            }
            noFill();
            strokeWeight(w/2);
            stroke(0,255,0);
            beginShape();
            for(i = 0; i < finalPath.length; i++) {
                //path[i].show('blue');
                vertex(finalPath[i].x * w + w / 2, finalPath[i].y * h + h / 2);
            }
            endShape();
            console.log("done");
            noLoop();
            return;
        }
        openSet.splice(openSet.indexOf(current), 1);
        closedSet.push(current);
        var tempG;
        for (i = 0; i < current.neighbours.length; i++) {
            if ((closedSet.indexOf(current.neighbours[i]) !== -1) || current.neighbours[i].obstacle) {
                //console.log("already Evaluated", i);
            }
            else {
                if (openSet.indexOf(current.neighbours[i]) === -1) {
                    openSet.push(current.neighbours[i]);
                }
                tempG = current.g + 1;//Math.floor(Math.random()*(5-1+1)+1);
                if (tempG >= current.neighbours[i].g) {
                   // console.log("not better path");
                } else {
                    current.neighbours[i].cameFrom = current;
                    current.neighbours[i].g = tempG;
                    current.neighbours[i].f = current.neighbours[i].g + heuristic(current.neighbours[i], end);
                }
            }
        }

    } else {
        console.log("There is no solution");
        noLoop();
    }
    for(i = 0; i < rows; i++) {
        for(j = 0; j < cols; j++) {
            grid[i][j].show('white');
        }
    }
    /*for(i = 0; i < closedSet.length; i++) {
        closedSet[i].show('red');
    }*/
    /*for(i = 0; i < openSet.length; i++) {
        openSet[i].show('green');
    }*/
    path = [];
    temp = current;
    path.push(temp);
    while(temp.cameFrom) {
        path.push(temp.cameFrom);
        temp = temp.cameFrom;
    }

    noFill();
    strokeWeight(w/3);
    stroke(200,35,35);
    beginShape();
    for(i = 0; i < path.length; i++) {
        //path[i].show('blue');
        vertex(path[i].x * w + w / 2, path[i].y * h + h / 2);
    }
    endShape();

}