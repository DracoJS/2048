var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');


var sizeInput = document.getElementById("size");
var changeSize = document.getElementById("change-size");
var scoreLabel = document.getElementById("score");

var score;
var size = 4;
var width = canvas.width / size - 6;
var undos;

var cells = [];
var fontSize;
var loss;

var states;

startGame();

changeSize.onclick = function () {
  if (sizeInput.value >= 2 && sizeInput.value <= 20) {
    size = sizeInput.value;
    width = canvas.width / size - 6;
    console.log(sizeInput.value);
    canvasClean();
    startGame();
  }
}

function cell(row, coll) {
  this.value = 0;
  this.x = coll * width + 5 * (coll + 1);
  this.y = row * width + 5 * (row + 1);
}

function createCells() {
  for (var i = 0; i < size; i++) {
    cells[i] = [];
    for (var j = 0; j < size; j++) {
      cells[i][j] = new cell(i, j);
    }
  }
}

function saveState() {
  var state = [];
  for (var i = 0; i < size; i++) {
    state[i] = [];
    for (var j = 0; j < size; j++) {
      state[i][j] = cells[i][j].value;
    }
  }
  while (states.length >= undos) {
    states.shift();
  }
  states.push({ score: score, values: state });
}

function undo() {
  if (undos == 0 || states.length == 0)
    return;
  var state = states.pop();
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      cells[i][j].value = state.values[i][j];
    }
  }
  score = state.score;
  undos--;
  drawAllCells();
}

function drawCell(cell) {
  ctx.beginPath();
  ctx.rect(cell.x, cell.y, width, width);
  switch (cell.value){
    case 0 : ctx.fillStyle = "#A9A9A9"; break;
    case 2 : ctx.fillStyle = "#D2691E"; break;
    case 4 : ctx.fillStyle = "#FF7F50"; break;
    case 8 : ctx.fillStyle = "#ffbf00"; break;
    case 16 : ctx.fillStyle = "#bfff00"; break;
    case 32 : ctx.fillStyle = "#40ff00"; break;
    case 64 : ctx.fillStyle = "#00bfff"; break;
    case 128 : ctx.fillStyle = "#FF7F50"; break;
    case 256 : ctx.fillStyle = "#0040ff"; break;
    case 512 : ctx.fillStyle = "#ff0080"; break;
    case 1024 : ctx.fillStyle = "#D2691E"; break;
    case 2048 : ctx.fillStyle = "#FF7F50"; break;
    case 4096 : ctx.fillStyle = "#ffbf00"; break;
    default : ctx.fillStyle = "#ff0080";
  }
  ctx.fill();
  if (cell.value) {
    fontSize = width/2;
    ctx.font = fontSize + "px Arial";
    ctx.fillStyle = 'white';
    ctx.textAlign = "center";
    ctx.fillText(cell.value, cell.x + width / 2, cell.y + width / 2 + width/7);
  }
}
function canvasClean() {
  ctx.clearRect(0, 0, 500, 500);
}
document.onkeydown = function (event) {
  if (!loss) {
    if (event.keyCode == 38 || event.keyCode == 87) moveUp();
    else if (event.keyCode == 39 || event.keyCode == 68) moveRight();
    else if (event.keyCode == 40 || event.keyCode == 83) moveDown();
    else if (event.keyCode == 37 || event.keyCode == 65) moveLeft();
    else if (event.keyCode == 90) undo();
  }
}
function startGame() {
  score = 0;
  loss = false;
  canvas.style.opacity = "1";
  
  createCells();
  drawAllCells();
  pasteNewCell();
  pasteNewCell();

  states = [];
  undos = 6;
}
function finishGame() {
  canvas.style.opacity = "0.5";
  loss = true;
}
function drawAllCells() {
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      drawCell(cells[i][j]);
    }
  }
  scoreLabel.innerHTML = "Score : " + score;
}
function pasteNewCell() {
  var countFree = 0;
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      if (!cells[i][j].value) {
        countFree++;
      }
    }
  }
  if (!countFree){
    finishGame();
    return;
  }
  while (true) {
    var row = Math.floor(Math.random() * size);
    var coll = Math.floor(Math.random() * size);
    if (!cells[row][coll].value) {
      cells[row][coll].value = 2 * Math.ceil(Math.random() * 2);
      drawAllCells();
      return;
    }
  }
}
function moveRight () {
  saveState();
  for (var i = 0; i < size; i++) {
    for (var j = size - 2; j >= 0; j--) {
      if (cells[i][j].value) {
        var coll = j;
        while (coll + 1 < size) {
          if (!cells[i][coll + 1].value) {
            cells[i][coll + 1].value = cells[i][coll].value;
            cells[i][coll].value = 0;
            coll++;
          }
          else if (cells[i][coll].value == cells[i][coll + 1].value) {
            cells[i][coll + 1].value *= 2;
            score +=  cells[i][coll + 1].value;
            cells[i][coll].value = 0;
            break;
          }
          else break;
        }
      }
    }
  }
  pasteNewCell();
}

function moveLeft() {
  saveState();
  for (var i = 0; i < size; i++) {
    for (var j = 1; j < size; j++) {
      if (cells[i][j].value) {
        var coll = j;
        while (coll - 1 >= 0) {
          if (!cells[i][coll - 1].value) {
            cells[i][coll - 1].value = cells[i][coll].value;
            cells[i][coll].value = 0;
            coll--;
          }
          else if (cells[i][coll].value == cells[i][coll - 1].value) {
            cells[i][coll - 1].value *= 2;
            score +=   cells[i][coll - 1].value;
            cells[i][coll].value = 0;
            break;
          }
          else break;
        }
      }
    }
  }
  pasteNewCell();
}

function moveUp() {
  saveState();
  for (var j = 0; j < size; j++) {
    for (var i = 1; i < size; i++) {
      if (cells[i][j].value) {
        var row = i;
        while (row > 0) {
          if (!cells[row - 1][j].value) {
            cells[row - 1][j].value = cells[row][j].value;
            cells[row][j].value = 0;
            row--;
          }
          else if (cells[row][j].value == cells[row - 1][j].value) {
            cells[row - 1][j].value *= 2;
            score +=  cells[row - 1][j].value;
            cells[row][j].value = 0;
            break;
          }
          else break;
        }
      }
    }
  }
  pasteNewCell();
}

function moveDown() {
  saveState();
  for (var j = 0; j < size; j++) {
    for (var i = size - 2; i >= 0; i--) {
      if (cells[i][j].value) {
        var row = i;
        while (row + 1 < size) {
          if (!cells[row + 1][j].value) {
            cells[row + 1][j].value = cells[row][j].value;
            cells[row][j].value = 0;
            row++;
          }
          else if (cells[row][j].value == cells[row + 1][j].value) {
            cells[row + 1][j].value *= 2;
            score +=  cells[row + 1][j].value;
            cells[row][j].value = 0;
            break;
          }
          else break;
        }
      }
    }
  }
  pasteNewCell();
}
