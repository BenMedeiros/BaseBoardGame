'use strict';

//build board, populate tiles, and set the initial tile postitions
function rebuildBoard() {
  console.log('rebuildBoard');
  clearGameboardElement();
  updateGameboardElement();

  tiles.length = 0;
  for (let x = 0; x < gameConfig.numCols; x++) {
    for (let y = 0; y < gameConfig.numRows; y++) {
      const tile = {id: tiles.length, x, y};
      tiles.push(tile);
      createTileElement(tile);
    }
  }
  //build the control buttons/inserts
  inserts.length = 0;
  for (let i = 0; i < gameConfig.numCols; i++) {
    const insert1 = {id: inserts.length, col: i, direction: 1};
    inserts.push(insert1);
    createInsertElement(insert1);
    const insert2 = {id: inserts.length, col: i, direction: -1};
    inserts.push(insert2);
    createInsertElement(insert2);
  }
  for (let i = 0; i < gameConfig.numRows; i++) {
    const insert1 = {id: inserts.length, row: i, direction: 1};
    inserts.push(insert1);
    createInsertElement(insert1);
    const insert2 = {id: inserts.length, row: i, direction: -1};
    inserts.push(insert2);
    createInsertElement(insert2);
  }
}

//function to move tile
function moveTileBy(tile, move_x, move_y) {
  if (move_x) tile.x += move_x;
  if (move_y) tile.y += move_y;
  if (move_x || move_y) updateTileElement(null, tile);
}

function moveTileTo(tile, x = null, y = null) {
  if (x !== null) tile.x = x;
  if (y !== null) tile.y = y;
  if (x !== null || y !== null) updateTileElement(null, tile);
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

function collapseSettingElement(event) {
  if (gameState.settingsExpanded) {
    const gameConfigEl = document.getElementById('gameConfig');
    gameState.settingsExpanded = false;
    if(!gameConfigEl.classList.contains('collapsed')) gameConfigEl.classList.add('collapsed')
  }
}

function expandSettingElement(event) {
  event.stopPropagation();
  if (!gameState.settingsExpanded) {
    const gameConfigEl = document.getElementById('gameConfig');
    gameState.settingsExpanded = true;
    if(gameConfigEl.classList.contains('collapsed')) gameConfigEl.classList.remove('collapsed');
  }
}


console.log('buildBoard loaded');

loadConfigFromStorage();
populateUiSettingsFromConfig();
rebuildBoard();
togglePlay(0);

const gameConfigEl = document.getElementById('gameConfig');
document.addEventListener('click', collapseSettingElement);
gameConfigEl.addEventListener('click', expandSettingElement);


for (let i = 0; i < 5; i++) {
  setTimeout(moveRow.bind(null, 20,1), 200*i);
}



