'use strict';

const tiles = [];

const tileTypes = {
  plus: 'tile-plus',
  t: 'tile-t',
  straight: 'tile-straight',
  turn: 'tile-turn',
  end: 'tile-end'
}
//for each side of tile, is it a path
const tilePaths = {
  plus: [1, 1, 1, 1],
  t: [1, 1, 0, 1],
  straight: [0, 1, 0, 1],
  turn: [1, 1, 0, 0],
  end: [0, 1, 0, 0]
}

function createTile(x, y, rotation, type) {
  if (x === null || x === undefined) x = -1;
  if (y === null || y === undefined) y = -1;
  if (rotation === null || rotation === undefined) rotation = 0;
  if (!type) type = utils.randomFrom(Object.keys(tileTypes));

  const tile = {
    id: tiles.length,
    type,
    getUiElement: function () {
      return document.getElementById('tile' + this.id);
    },
    updateUiElementTitle: function () {
      if (this.getUiElement()) this.getUiElement().title = JSON.stringify(this);
    }
  };
  Object.defineProperty(tile, 'getUiElement', {enumerable: false});
  Object.defineProperty(tile, 'updateUiElementTitle', {enumerable: false});

  Object.defineProperties(tile, {
    _x: {
      value: -1,
      writable: true,
      enumerable: false,
    },
    x: {
      enumerable: true,
      get() {
        return this._x;
      },
      set(x) {
        if (x === this._x) return;
        this._x = x;
        this.getUiElement()?.style.setProperty('--tile-x', x);
        this.updateUiElementTitle();
      }
    },
    _y: {
      value: -1,
      writable: true,
      enumerable: false,
    },
    y: {
      enumerable: true,
      get() {
        return this._y;
      },
      set(y) {
        if (y === this._y) return;
        this._y = y;
        this.getUiElement()?.style.setProperty('--tile-y', y);
        this.updateUiElementTitle();
      }
    },
    _rotation: {
      value: 0,
      writable: true,
      enumerable: false,
    },
    rotation: {
      enumerable: true,
      get() {
        return this._rotation;
      },
      set(deg) {
        if (deg === this._rotation) return;
        this._rotation = deg;
        this.getUiElement()?.style.setProperty('--tile-rotation', deg);

        if (deg % 180 === 0) {
          this.getUiElement()?.style.setProperty('--tile-rotation-x', deg % 360 === 0 ? 1 : -1);
          this.getUiElement()?.style.setProperty('--tile-rotation-y', 0);
        } else if (Math.abs(deg % 180) === 90) {
          this.getUiElement()?.style.setProperty('--tile-rotation-x', 0);
          this.getUiElement()?.style.setProperty('--tile-rotation-y', (deg + 90) % 360 === 0 ? 1 : -1);
        } else {
          throw new Error('Cant handle none quarter rotations yet.');
        }
      }
    },
    _isActiveTile: {
      value: false,
      writable: true,
      enumerable: false,
    },
    isActiveTile: {
      enumerable: true,
      get() {
        return this._isActiveTile;
      },
      set(bool) {
        if (this._isActiveTile === bool) return;
        this._isActiveTile = bool;
        if (!bool) {
          this.getUiElement()?.classList.remove('active-tile');
          // if setting inactive we're done
        } else {
          this.getUiElement()?.classList.add('active-tile');
          if (!gameState.activeTileId) {
            gameState.activeTileId = this.id;
          } else if (gameState.activeTileId !== this.id) {
            gameState.activeTile.isActiveTile = false;
            gameState.activeTile = this;
          } else {
            throw new Error('impossible isActiveTile state');
          }
        }
      }
    }
  });

  //set initial values, triggering element updates
  tile.x = x;
  tile.y = y;
  tile.rotation = rotation;
  tiles.push(tile);
  return tile;
}

function deleteAllTiles() {
  for (const tile of tiles) {
    tile.getUiElement().remove();
  }
  tiles.length = 0;
}


//return true if tiles are connected accounting for type/rotation
function areTilesConnectedAdjacent(tile1, tile2) {
  if (!tile1 || !tile2) return false;
  //active tiles may be adjacent but are not connected for moving
  if (tile1.isActiveTile || tile2.isActiveTile) return false;

  const xDistance = tile1.x - tile2.x;
  const yDistance = tile1.y - tile2.y;

  //rotation could be any magnitude and negative, convert to 0,1,2,3
  let tile1RotationIndex = ((tile1.rotation % 360) + 360) / 90;
  let tile2RotationIndex = ((tile2.rotation % 360) + 360) / 90;

  if (yDistance === 1 && xDistance === 0) {
    tile2RotationIndex += 2;
  } else if (yDistance === -1 && xDistance === 0) {
    tile1RotationIndex += 2
  } else if (xDistance === 1 && yDistance === 0) {
    tile1RotationIndex += 1;
    tile2RotationIndex += 3;
  } else if (xDistance === -1 && yDistance === 0) {
    tile1RotationIndex += 3;
    tile2RotationIndex += 1;
  } else {
    return false;
  }

  tile1RotationIndex %= 4;
  tile2RotationIndex %= 4;

  return tilePaths[tile1.type][tile1RotationIndex] && tilePaths[tile2.type][tile2RotationIndex];
}

// gets possible connected paths, brute force
function getAllConnectedAdjacentTiles(thisTile) {
  return tiles.filter(tile => areTilesConnectedAdjacent(tile, thisTile));
}

//includes thisTile
function getAllConnectedTiles(thisTile, connectedTiles = []) {
  if (connectedTiles.length === 0) connectedTiles.push(thisTile);
  for (const tile of getAllConnectedAdjacentTiles(thisTile)) {
    if (!connectedTiles.find(el => el.id === tile.id)) {
      connectedTiles.push(tile);
      getAllConnectedTiles(tile, connectedTiles);
    }
  }
  return connectedTiles;
}

function highlightTile(thisTile, duration = 1500) {
  for (const tile of tiles) {
    const el = tile.getUiElement();
    el.classList.remove('connected-tiles');
    el.classList.add('unconnected-tiles');
  }

  const el = document.getElementById('tile' + thisTile.id);
  el.classList.remove('unconnected-tiles');
  el.classList.add('connected-tiles');

  setTimeout(removeConnectedTilesHighlights, duration);
}

function highlightAllConnectedTiles(thisTile, duration = 1500) {
  for (const tile of tiles) {
    const el = tile.getUiElement();
    el.classList.remove('connected-tiles');
    el.classList.add('unconnected-tiles');
  }
  for (const tile of getAllConnectedTiles(thisTile)) {
    const el = tile.getUiElement();
    el.classList.remove('unconnected-tiles');
    el.classList.add('connected-tiles');
  }

  setTimeout(removeConnectedTilesHighlights, duration);
}

function removeConnectedTilesHighlights() {
  for (const tile of tiles) {
    const el = tile.getUiElement();
    el.classList.remove('unconnected-tiles');
    el.classList.remove('connected-tiles');
  }
}

function getTileByXY(x, y) {
  for (const tile of tiles) {
    if (tile.x === x && tile.y === y) return tile;
  }
}
