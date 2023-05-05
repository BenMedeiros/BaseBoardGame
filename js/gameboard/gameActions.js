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
  console.log(insert);
  if (insert.row !== undefined) {
    moveTileTo(gameState.activeTile, insert.x, insert.y);
    moveRow(insert.row, insert.direction);
  }
  if (insert.col !== undefined) {
    moveTileTo(gameState.activeTile, insert.x, insert.y);
    moveColumn(insert.col, insert.direction);
  }
}

function moveTileTo(tile, x = null, y = null) {
  if (x === null && y === null) return;
  const el = document.getElementById('tile' + tile.id);
  const animation = el.animate([
    {
      top: `${tile.y * gameConfig.tileHeight}rem`,
      left: `${tile.x * gameConfig.tileWidth}rem`,
    },
    {
      top: `${y * gameConfig.tileHeight}rem`,
      left: `${x * gameConfig.tileWidth}rem`,
    }
  ], {duration: 4000, iterations: 1});

  tile.x = x;
  tile.y = y;

  //update progress bar for fun
  const progressEl = document.getElementsByTagName("progress")[0];
  progressEl.value = 0;
  const intervalId = setInterval(() => {
    progressEl.value = animation.effect.getComputedTiming().progress;
  }, 50);

  animation.onfinish = () => {
    clearInterval(intervalId);
    progressEl.value = 1;
    //persist the movement animation
    el.style.top = `${tile.y * gameConfig.tileHeight}rem`;
    el.style.left = `${tile.x * gameConfig.tileWidth}rem`;
  };
}

function moveRow(row, direction) {
  for (const tile of tiles) {
    if (tile.y === row) {
      moveTileTo(tile, tile.x + direction, tile.y);
      if (tile.x === -1 || tile.x === gameConfig.numCols) {
        makeTileActive(tile);
        //move it alittle off the board after it slides
        moveTileTo(tile, tile.x + (direction * .2), tile.y);
      }
    }
  }
}

function moveColumn(col, direction) {
  for (const tile of tiles) {
    if (tile.x === col) {
      moveTileTo(tile, tile.x, tile.y + direction);
      if (tile.y === -1 || tile.y === gameConfig.numRows) {
        makeTileActive(tile);
        //move it alittle off the board after it slides
        moveTileTo(tile, tile.x, tile.y + (direction * .2));
      }
    }
  }
}