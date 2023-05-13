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

function tempDisableAllInserts(duration) {
  //could use promises here, but mainly just preventing spamming
  if (tempStates.insertsTempDisabledTimeoutId) return;

  const els = gameboardElement.querySelectorAll('.insert');
  els.forEach(el => el.toggleAttribute('disabled', true));
  // thought about promising against the animations but user waits too long
  //if timeout exists, they should already be disabled..
  tempStates.insertsTempDisabledTimeoutId = setTimeout(() => {
    els.forEach(el => {
      if (el.id === 'insert' + gameState.disabledInsertId) {
        // console.log(gameState.disabledInsertId + ' is currently disabled');
      } else {
        el.removeAttribute('disabled');
      }
    });
    tempStates.insertsTempDisabledTimeoutId = null;
  }, duration);
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

function triggerInsertClickedByXY(x,y){
  for (const insert of inserts) {
    if(insert.disabled) continue;
    if (insert.x === x && insert.y === y) {
      document.dispatchEvent(new CustomEvent('insert-clicked', {detail: {insert}}));
      return;
    }
  }
}

function insertClicked(insert) {
  //don't trigger if currently disabled
  if(tempStates.insertsTempDisabledTimeoutId) return;
  if(insert.disabled) return;
  if(insert.row === undefined && insert.col === undefined){
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

// calculate the el.style.top based on x,y accounting for offsetting when on insert
function calcTileStyleLeft(x, y) {
  for (const insert of inserts) {
    if (insert.x === x && insert.y === y) {
      if (insert.row !== undefined) {
        return `${(x - .2 * insert.direction) * gameConfig.tileHeight}rem`;
      }
    }
  }
  //not on an insert
  return `${x * gameConfig.tileHeight}rem`;
}

// calculate the el.style.top based on x,y accounting for offsetting when on insert
function calcTileStyleTop(x, y) {
  for (const insert of inserts) {
    if (insert.x === x && insert.y === y) {
      if (insert.col !== undefined) {
        return `${(y - .2 * insert.direction) * gameConfig.tileHeight}rem`;
      }
    }
  }
  //not on an insert
  return `${y * gameConfig.tileHeight}rem`;
}

function moveTileTo(tile, x = null, y = null, duration = 2000) {
  // console.log('moveTileTo', tile, x, y)
  if (x === null && y === null) return;
  const el = document.getElementById('tile' + tile.id);
  const animation = el.animate([
    {
      top: calcTileStyleTop(tile.x, tile.y),
      left: calcTileStyleLeft(tile.x, tile.y)
    },
    {
      top: calcTileStyleTop(x, y),
      left: calcTileStyleLeft(x, y)
    }
  ], {duration: duration, iterations: 1});

  tile.x = x;
  tile.y = y;
  el.title = JSON.stringify(tile);

  //update progress bar for fun
  const progressEl = document.getElementsByTagName("progress")[0];
  progressEl.value = 0;
  const intervalId = setInterval(() => {
    progressEl.value = animation.effect.getComputedTiming().progress;
  }, 50);

  tempDisableAllInserts(duration);

  animation.onfinish = () => {
    clearInterval(intervalId);
    progressEl.value = 1;
    //persist the movement animation
    el.style.top = calcTileStyleTop(tile.x, tile.y);
    el.style.left = calcTileStyleLeft(tile.x, tile.y);
  };
}

function rotateTileTo(tile, deg) {
  if (tile.rotation !== deg) {
    const el = document.getElementById('tile' + tile.id);
    tile.rotation = deg;
    el.style.rotate = tile.rotation + 'deg';
  }
}

function rotateTileBy(tile, deg) {
  if (deg) {
    rotateTileTo(tile, tile.rotation + deg);
  }
}

function moveRow(row, direction) {
  for (const tile of tiles) {
    if (tile.y === row) {
      moveTileTo(tile, tile.x + direction, tile.y);
      if (tile.x === -1 || tile.x === gameConfig.numCols) {
        makeTileActive(tile);
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
      }
    }
  }
}

document.addEventListener('insert-clicked', e => insertClicked(e.detail.insert));
document.addEventListener('tile-clicked', e => tileClicked(e.detail.tile));
