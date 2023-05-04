'use strict';


const tiles = [];
const inserts = [];

const gameConfig = {
  playerName: null,
  autoResize: false,
  tileWidth: 8,
  tileHeight: 8,
  numCols: 4,
  numRows: 4
};

Object.defineProperties(gameConfig, {
  numTiles: {
    get() {
      return this.numRows * this.numCols
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
  lastInsertionPoint: null,
  settingsExpanded: true
}


function loadConfigFromStorage() {
  if (!localStorage.getItem('gameConfig')) saveConfigToStorage();

  const savedConfig = JSON.parse(localStorage.getItem('gameConfig'));
  for (const [key, oldValue] of Object.entries(gameConfig)) {
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
      if (configElement.id === 'autoResize') {
        configElement.toggleAttribute('checked', Boolean(value));
      } else {
        configElement.value = value;
      }
    }
  }
}

function readUiSettingsIntoConfig(){
  const formElement = document.getElementById('gameConfig');
  const formData = new FormData(formElement);
  for (const key of Object.keys(gameConfig)) {
    gameConfig[key] = formData.get(key);
  }
}
