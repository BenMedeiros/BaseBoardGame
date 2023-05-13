'use strict';


const inserts = []

const gameConfig = {
  playerName: null,
  animateStart: false,
  tileWidth: 8,
  // tileHeight: 8,
  numCols: 4,
  numRows: 4
};

Object.defineProperties(gameConfig, {
  numTiles: {
    get() {
      return (this.numRows * this.numCols) + 1
    }
  },
  tileHeight : {
    get() {
      return this.tileWidth
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
  disabledInsertId: null
}

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
      return tiles[this.activeTileIdHistory[this.activeTileIdHistory.length-1]];
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
});


function loadConfigFromStorage() {
  if (!localStorage.getItem('gameConfig')) saveConfigToStorage();

  const savedConfig = JSON.parse(localStorage.getItem('gameConfig'));
  for (const [key] of Object.entries(gameConfig)) {
    gameConfig[key] = savedConfig[key];
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
    if (typeof (value) === 'number') {
      gameConfig[key] = Number(formData.get(key));
    } else if (typeof (value) === 'boolean') {
      gameConfig[key] = Boolean(formData.get(key));
    } else {
      gameConfig[key] = formData.get(key);
    }
  }
}
