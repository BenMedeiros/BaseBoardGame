'use strict';

async function updateBoard(event) {
  readUiSettingsIntoConfig();
  saveConfigToStorage();
  // loadConfigFromStorage();
  rebuildBoard();
}

function makeTileActive(tile) {
  tile.isActiveTile = true;
  gameState.activeTile.isActiveTile = false;
  updateTileElement(null, gameState.activeTile);
  updateTileElement(null, tile);
  gameState.activeTile = tile;
}

async function tileClicked(event) {
  const tile = tiles[event.target.id.substr('tile'.length)];
  console.log('clicked', tile);
}

async function insertClicked(insert) {
  if (insert.row !== undefined) {
    moveRow(insert.row, insert.direction);
  }
  if (insert.col !== undefined) {
    moveColumn(insert.col, insert.direction);
  }
}

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
    if (tile.y === row) {
      moveTileBy(tile, direction, 0);
      if (tile.x === -1 || tile.x === gameConfig.numCols) {
        makeTileActive(tile);
      }
    }
  }
}

function moveColumn(col, direction) {
  for (const tile of tiles) {
    if (tile.x === col) {
      moveTileBy(tile, 0, direction);
      if (tile.y === -1 || tile.y === gameConfig.numCols) {
        makeTileActive(tile);
      }
    }
  }
}
