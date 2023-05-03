'use strict';

const tiles = [];
const gameConfig = {
  tileWidth: 8,
  tileHeight: 8,
  numCols: 4,
  numRows: 4,
  numTiles : 16,
  boardHeight : 32,
  boardWidth : 32
}

const formElement = document.getElementById('gameConfig');
// save the updated form data into game config
formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(formElement);
  for (const [key, value] of formData) {
    gameConfig[key] = value;
  }

  gameConfig.numTiles = gameConfig.numCols * gameConfig.numRows;
  gameConfig.boardWidth = gameConfig.numCols * gameConfig.tileWidth;
  gameConfig.boardHeight = gameConfig.numRows * gameConfig.tileHeight;

  rebuildBoard();
});

// update tile element to it's x/y
function updateTileStyle(tile) {
  const tileElement = document.getElementById('tile' + tile.i);
  if (!tileElement) return;
  tileElement.style.top = `${tile.y * gameConfig.tileHeight}rem`;
  tileElement.style.left = `${tile.x * gameConfig.tileWidth}rem`;
  tileElement.style.height = `${gameConfig.tileHeight}rem`;
  tileElement.style.width = `${gameConfig.tileWidth}rem`;

  tileElement.innerHTML = `${tile.i}: (${tile.x}, ${tile.y})`;
}


//build board, populate tiles, and set the initial tile postitions
function rebuildBoard() {
  const gameboardElement = document.getElementById("gameboard");
  if (!gameboardElement) return console.warn('gameboard element not found.');
  gameboardElement.style.width = gameConfig.boardWidth + 'rem';
  gameboardElement.style.height = gameConfig.boardHeight + 'rem';

  let htmlBuilder = '';
  tiles.length = 0;
  for (let i = 0; i < gameConfig.numTiles; i++) {
    htmlBuilder += `<button class="tile" id="${'tile' + i}"/>`;
    tiles.push({
      i,
      x: i % gameConfig.numCols,
      y: Math.floor(i / gameConfig.numCols)
    });
  }

  gameboardElement.innerHTML = htmlBuilder;
  tiles.forEach(updateTileStyle);
}

//function to move tile
function moveTileBy(tile, move_x, move_y) {
  if (move_x) tile.x += move_x;
  if (move_y) tile.y += move_y;
  if (move_x || move_y) updateTileStyle(tile);
}

function moveTileTo(tile, x = null, y = null) {
  if (x !== null) tile.x = x;
  if (y !== null) tile.y = y;
  if (x !== null || y !== null) updateTileStyle(tile);
}

function moveRow(row, direction) {
  for (const tile of tiles) {
    if (tile.y === row) moveTileBy(tile, direction, 0);
  }
}


console.log('buildBoard loaded');
rebuildBoard();
setInterval(() => moveRow(2, 1), 3000);

