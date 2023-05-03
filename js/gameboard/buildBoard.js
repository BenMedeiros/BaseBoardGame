'use strict';

const tiles = [];
const inserts = [];
const gameConfig = {
  tileWidth: 8,
  tileHeight: 8,
  numCols: 4,
  numRows: 4,
  numTiles: 16,
  boardHeight: 32,
  boardWidth: 32
};
const gameState = {
  lastInsertionPoint: null
}


const formElement = document.getElementById('gameConfig');
// save the updated form data into game config
formElement.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(formElement);
  for (const [key, value] of formData) {
    gameConfig[key] = value;
  }

  saveConfigToStorage();
  loadConfigFromStorage();
  rebuildBoard();
});

function loadConfigFromStorage() {
  if (localStorage.getItem('gameConfig')) {
    const savedConfig = JSON.parse(localStorage.getItem('gameConfig'));
    for (const [key, value] of Object.entries(savedConfig)) {
      gameConfig[key] = value;
      const configElement = document.getElementById(key);
      if (configElement) configElement.value = value;
    }
  }

  gameConfig.numTiles = gameConfig.numCols * gameConfig.numRows;
  gameConfig.boardWidth = gameConfig.numCols * gameConfig.tileWidth;
  gameConfig.boardHeight = gameConfig.numRows * gameConfig.tileHeight;
}

function saveConfigToStorage() {
  localStorage.setItem('gameConfig', JSON.stringify(gameConfig));
}

// update tile element to it's x/y
function updateTileStyle(tile) {
  const el = document.getElementById('tile' + tile.id);
  if (!el) return;
  el.style.top = `${tile.y * gameConfig.tileHeight}rem`;
  el.style.left = `${tile.x * gameConfig.tileWidth}rem`;
  el.style.height = `${gameConfig.tileHeight}rem`;
  el.style.width = `${gameConfig.tileWidth}rem`;

  el.innerHTML = `${tile.id}: <br/>(${tile.x}, ${tile.y})`;
}

function updateInsertionStyle(insert) {
  const el = document.getElementById('insert' + insert.id);
  if (!el) return;
  el.style.height = `${gameConfig.tileHeight / 2}rem`;
  el.style.width = `${gameConfig.tileWidth / 2}rem`;
  //put on sides of row
  if (insert.row !== undefined) {
    el.style.top = `${(insert.row + .25) * gameConfig.tileHeight}rem`;
    if (insert.direction > 0) {
      el.style.left = `${gameConfig.tileWidth / -2}rem`;
    } else {
      el.style.left = `${gameConfig.boardWidth}rem`;
    }
  }
//put on top/bottom of col
  if (insert.col !== undefined) {
    el.style.left = `${(insert.col + .25) * gameConfig.tileWidth}rem`;
    if (insert.direction > 0) {
      el.style.top = `${gameConfig.tileHeight / -2}rem`;
    } else {
      el.style.top = `${gameConfig.boardHeight}rem`;
    }
  }

  el.innerHTML = JSON.stringify(insert);
}


//build board, populate tiles, and set the initial tile postitions
function rebuildBoard() {
  const gameboardElement = document.getElementById("gameboard");
  if (!gameboardElement) return console.warn('gameboard element not found.');
  gameboardElement.style.width = gameConfig.boardWidth + 'rem';
  gameboardElement.style.height = gameConfig.boardHeight + 'rem';

  let htmlBuilder = '';
  tiles.length = 0;
  for (let x = 0; x < gameConfig.numCols; x++) {
    for (let y = 0; y < gameConfig.numRows; y++) {
      htmlBuilder += `<button class="tile" id="${'tile' + tiles.length}"/>`;
      tiles.push({id: tiles.length, x, y});
    }
  }
  //build the control buttons/inserts
  inserts.length = 0;
  for (let i = 0; i < gameConfig.numCols; i++) {
    htmlBuilder += `<button class="insert" id="${'insert' + inserts.length}"/>`;
    inserts.push({id: inserts.length, col: i, direction: 1});
    htmlBuilder += `<button class="insert" id="${'insert' + inserts.length}"/>`;
    inserts.push({id: inserts.length, col: i, direction: -1});
  }
  for (let i = 0; i < gameConfig.numRows; i++) {
    htmlBuilder += `<button class="insert" id="${'insert' + inserts.length}"/>`;
    inserts.push({id: inserts.length, row: i, direction: 1});
    htmlBuilder += `<button class="insert" id="${'insert' + inserts.length}"/>`;
    inserts.push({id: inserts.length, row: i, direction: -1});
  }

  gameboardElement.innerHTML = htmlBuilder;
  tiles.forEach(updateTileStyle);
  inserts.forEach(updateInsertionStyle);
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

function moveColumn(col, direction) {
  for (const tile of tiles) {
    if (tile.x === col) moveTileBy(tile, 0, direction);
  }
}

let timer = null;
let currentDirection = null;

function togglePlay(direction) {
  console.log('toggle play', direction);
  const leftButtonEl = document.getElementById('leftButton');
  const rightButtonEl = document.getElementById('rightButton');
  const pauseButtonEl = document.getElementById('pauseButton');

  if (currentDirection === direction) return;

  if (currentDirection === -1) {
    leftButtonEl.classList.remove('fa-beat');
  } else if (currentDirection === 0) {
    pauseButtonEl.classList.remove('fa-beat');
  } else if (currentDirection === 1) {
    rightButtonEl.classList.remove('fa-beat');
  }
  clearInterval(timer);
  currentDirection = direction;

  if (direction === -1) {
    leftButtonEl.classList.add('fa-beat');
    timer = setInterval(() => moveRow(2, direction), 1000);
  } else if (direction === 0) {
    pauseButtonEl.classList.add('fa-beat');
  } else if (direction === 1) {
    rightButtonEl.classList.add('fa-beat');
    timer = setInterval(() => moveRow(2, direction), 1000);
  }
}

function addCollapsibleListeners() {
  const coll = document.getElementsByClassName("collapsibleController");

  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
      this.classList.toggle("collapsed");
      const collapseTargetId = coll[i].getAttribute('collapseTargetId')
      const collapseTargetEl = document.getElementById(collapseTargetId);
      collapseTargetEl.classList.toggle('collapsed');
    });
  }
}


console.log('buildBoard loaded');
loadConfigFromStorage();
rebuildBoard();
togglePlay(0);
addCollapsibleListeners();
