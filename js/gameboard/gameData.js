'use strict';


const inserts = []

const gameConfig = {
  playerName: null,
  animateStart: false,
  // _tileWidth: 8,
  // tileHeight: 8,
  // numCols: 4,
  // numRows: 4,
  theme: null,
};

Object.defineProperties(gameConfig, {
  _tileWidth: {
    value: 8,
    writable: true,
    enumerable: false,
  },
  tileWidth: {
    enumerable: true,
    get() {
      return this._tileWidth
    },
    set(width) {
      this._tileWidth = width;
      document.documentElement.style.setProperty('--tileWidth', width + 'rem');
      document.documentElement.style.setProperty('--tileHeight', width + 'rem');
    }
  },
  tileHeight: {
    get() {
      return this.tileWidth
    }
  },
  _numCols: {
    value: 4,
    writable: true,
    enumerable: false,
  },
  numCols: {
    enumerable: true,
    get() {
      return this._numCols
    },
    set(num) {
      this._numCols = num;
      document.documentElement.style.setProperty('--num-cols', num);
    }
  },
  _numRows : {
    value: 4,
    writable: true,
    enumerable: false,
  },
  numRows: {
    enumerable: true,
    get() {
      return this._numRows
    },
    set(num) {
      this._numRows = num;
      document.documentElement.style.setProperty('--num-rows', num);
    }
  },
  numTiles: {
    get() {
      return (this.numRows * this.numCols) + 1
    }
  },
  boardWidth: {
    get() {
      return this.tileWidth * this.numCols
    }
  },
  boardHeight: {
    get() {
      return this.numRows * this.tileHeight
    }
  }
});


const tempStates = {
  insertsTempDisabledTimeoutId: null
}

const gameState = {
  settingsExpanded: true,
  activeTileId: 0,
  activeTileIdHistory: [],
  disabledInsertId: null,
  activePlayerId: null
};

Object.defineProperties(gameState, {
  activeTile: {
    get() {
      return tiles[this.activeTileId];
    },
    set(tile) {
      this.activeTileIdHistory.push(this.activeTileId);
      this.activeTileId = tile.id;
    }
  },
  lastActiveTile: {
    get() {
      return tiles[this.activeTileIdHistory[this.activeTileIdHistory.length - 1]];
    }
  },
  disabledInsert: {
    get() {
      return inserts[this.disabledInsertId];
    },
    set(insert) {
      this.disabledInsertId = insert.id;
    }
  },
  activePlayer: {
    get() {
      return players[this.activePlayerId];
    },
    set(player) {
      this.activePlayerId = player.id;
    }
  },
  activePlayerStep: {
    get() {
      if (this.activePlayer) return this.activePlayer.playerStep;
    },
    set(playerStep) {
      this.activePlayer.playerStep = playerStep;
    }
  }
});

Object.seal(gameState);
Object.seal(gameConfig);

function loadConfigFromStorage() {
  if (!localStorage.getItem('gameConfig')) saveConfigToStorage();

  const savedConfig = JSON.parse(localStorage.getItem('gameConfig'));
  for (const [key] of Object.entries(gameConfig)) {
    if (savedConfig[key] !== undefined && savedConfig[key] !== null) {
      gameConfig[key] = savedConfig[key];
    }
  }
}

function saveConfigToStorage() {
  localStorage.setItem('gameConfig', JSON.stringify(gameConfig));
}

function populateUiSettingsFromConfig() {
  for (const [key, value] of Object.entries(gameConfig)) {
    const configElement = document.getElementById(key);
    if (configElement) {
      if (configElement.type === 'checkbox') {
        configElement.toggleAttribute('checked', Boolean(value));
      } else {
        configElement.value = value;
      }
    }
  }
}

function readUiSettingsIntoConfig() {
  const formElement = document.getElementById('gameConfig');
  const formData = new FormData(formElement);
  for (const [key, value] of Object.entries(gameConfig)) {
    console.log(key, value, formData.get(key));
    if (formData.get(key) === null) continue;
    if (typeof (value) === 'number') {
      gameConfig[key] = Number(formData.get(key));
    } else if (typeof (value) === 'boolean') {
      gameConfig[key] = Boolean(formData.get(key));
    } else {
      gameConfig[key] = formData.get(key);
    }
  }
}
