'use strict';

async function updateBoard(event) {
  readUiSettingsIntoConfig();
  saveConfigToStorage();
  // loadConfigFromStorage();
  rebuildBoard();
}

function makeTileActive(tile) {
  tile.isActiveTile = true;
  // tile.isActiveTile = true;
  // gameState.activeTile.isActiveTile = false;
  // updateTileElement(null, gameState.activeTile);
  // updateTileElement(null, tile);
  // gameState.activeTile = tile;
}

function tempDisableAllInserts(duration) {
  if (tempStates.insertsTempDisabledTimeoutId) {
    //clear existing timeout and recreate with new duration
    clearTimeout(tempStates.insertsTempDisabledTimeoutId);
  } else {
    const els = gameboardElement.querySelectorAll('.insert');
    els.forEach(el => el.toggleAttribute('disabled', true));
  }
  tempStates.insertsTempDisabledTimeoutId = setTimeout(enableTempDisabledInserts, duration);
}

function enableTempDisabledInserts() {
  //keep disabled unless it's a player move tile turn
  tempStates.insertsTempDisabledTimeoutId = null;
  if (gameState.activePlayerStep !== ACTIVE_PLAYER_STEPS.INSERT_TILE) return;

  const els = gameboardElement.querySelectorAll('.insert');
  els.forEach(el => {
    if (el.id === 'insert' + gameState.disabledInsertId) {
      // console.log(gameState.disabledInsertId + ' is currently disabled');
    } else {
      el.removeAttribute('disabled');
    }
  });
}

function disableInsert(insert) {
  insert.disabled = true;
  if (!tempStates.insertsTempDisabledTimeoutId) {
    const el = document.getElementById('insert' + insert.id);
    el.toggleAttribute('disabled', true);
  }
}

function enableInsert(insert) {
  console.log('enabling ', insert);
  insert.disabled = false;
  if (!tempStates.insertsTempDisabledTimeoutId) {
    const el = document.getElementById('insert' + insert.id);
    el.removeAttribute('disabled');
  }
}

async function tileClicked(tile) {
  console.log('clicked', tile);
}

function triggerInsertClickedByXY(x, y) {
  for (const insert of inserts) {
    if (insert.disabled) continue;
    if (insert.x === x && insert.y === y) {
      document.dispatchEvent(new CustomEvent('insert-clicked', {detail: {insert}}));
      return;
    }
  }
}

function insertClicked(insert) {
  //don't trigger if currently disabled
  if (tempStates.insertsTempDisabledTimeoutId) return;
  if (insert.disabled) return;
  if (insert.row === undefined && insert.col === undefined) {
    throw new Error('not sure what config this insert is.')
  }
  if (insert.row !== undefined) {
    moveTileTo(gameState.activeTile, insert.x, insert.y);
    moveRow(insert.row, insert.direction);
  }
  if (insert.col !== undefined) {
    moveTileTo(gameState.activeTile, insert.x, insert.y);
    moveColumn(insert.col, insert.direction);
  }
  document.dispatchEvent(new CustomEvent('insert-clicked-success', {detail: {insert}}));

}

function moveTileTo(tile, x = null, y = null, duration = 2000) {
  // console.log('moveTileTo', tile, x, y)
  if (x === null && y === null) return;
  const el = document.getElementById('tile' + tile.id);

  el.style.setProperty('--tile-x', x);
  el.style.setProperty('--tile-y', y);
}

function moveRow(row, direction) {
  for (const tile of tiles) {
    if (tile.y === row) {
      tile.x += direction;
      if (tile.x === -1 || tile.x === gameConfig.numCols) {
        makeTileActive(tile);
      }
    }
  }
}

function moveColumn(col, direction) {
  for (const tile of tiles) {
    if (tile.x === col) {
      tile.y += direction;
      if (tile.y === -1 || tile.y === gameConfig.numRows) {
        makeTileActive(tile);
      }
    }
  }
}

function scrambleTilesThenReset() {
  for (const tile of tiles) {
    const startingX = tile.x;
    const startingY = tile.y;
    console.log(startingX, startingY);
    setTimeout(() => tile.x += utils.randomInt(-3, 3), 0);
    setTimeout(() => tile.y += utils.randomInt(-3, 3), 1000);
    setTimeout(() => tile.x += utils.randomInt(-3, 3), 2000);
    setTimeout(() => tile.y += utils.randomInt(-3, 3), 3000);
    setTimeout(() => tile.x += utils.randomInt(-3, 3), 4000);
    setTimeout(() => tile.y += utils.randomInt(-3, 3), 5000);
    setTimeout(() => {
      tile.x = startingX;
      tile.y = startingY;
    }, 6000);
  }
}

document.addEventListener('insert-clicked', e => insertClicked(e.detail.insert));
document.addEventListener('tile-clicked', e => tileClicked(e.detail.tile));
