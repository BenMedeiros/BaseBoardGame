'use strict';


const inserts = []

const gameConfig = {
  playerName: null,
  animateStart: false,
  _tileWidth: 8,
  // tileHeight: 8,
  numCols: 4,
  numRows: 4,
  theme: null,
};

const gameConfigStatic = {
  playerCharacterScale: .7,
}

Object.defineProperties(gameConfig, {
  tileWidth: {
    enumerable: true,
    get() {
      return this._tileWidth
    },
    set(width) {
      this._tileWidth = width;
      document.documentElement.style.setProperty('--tileWidth', width+'rem');
      document.documentElement.style.setProperty('--tileHeight', width+'rem');
    }
  },
  tileHeight: {
    get() {
      return this.tileWidth
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

const gameState = {
  settingsExpanded: true,
  activeTileId: 0,
  activeTileIdHistory: [],
  disabledInsertId: null,
  activePlayerId: null,
  activePlayerStep: 0
}

const ACTIVE_PLAYER_STEPS = {
  INACTIVE: 0,
  INSERT_TILE: 1,
  MOVE_CHARACTER: 2,
  DONE: 3
};

const tempStates = {
  insertsTempDisabledTimeoutId: null
}

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
  }
});


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
