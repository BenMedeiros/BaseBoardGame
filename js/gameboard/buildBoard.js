'use strict';

function getRandomTileType(){
  return Object.keys(tileTypes)[  utils.randomInt(0, Object.keys(tileTypes).length -1)];
}

//build board, populate tiles, and set the initial tile postitions
function rebuildBoard() {
  console.log('rebuildBoard');
  clearGameboardElement();
  updateGameboardElement();

  gameState.settingsExpanded = true;
  gameState.activeTileId = 0;
  gameState.activeTileIdHistory = [];
  gameState.disabledInsertId = null;

  tiles.length = 0;
  tiles.push({id: 0, x: -1, y: -1, isActiveTile: true, rotation: 0, type: getRandomTileType()});
  for (let x = 0; x < gameConfig.numCols; x++) {
    for (let y = 0; y < gameConfig.numRows; y++) {
      //option to spawn tiles as if you were scattering them
      if (gameConfig.animateStart) {
        const tile = {id: tiles.length, x: -1, y: -1, rotation: 0, type: getRandomTileType()}
        tiles.push(tile);
        setTimeout(() => {
          moveTileTo(tile, x, y, 2000 * Math.random());
          rotateTileTo(tile, utils.randomFrom([0, 90, 180, 270, 360, -90, -180, -270]));
        }, 1000 * Math.random());
      } else {
        tiles.push({id: tiles.length, x, y, rotation: 0, type: getRandomTileType()});
      }
    }
  }
  //build the control buttons/inserts
  inserts.length = 0;
  for (let i = 0; i < gameConfig.numCols; i++) {
    inserts.push({
      id: inserts.length, col: i,
      direction: 1, x: i, y: -1,
      rotation: 90, oppositeId: inserts.length + 1
    });
    inserts.push({
      id: inserts.length, col: i,
      direction: -1, x: i, y: gameConfig.numRows,
      rotation: -90, oppositeId: inserts.length - 1
    });
  }
  for (let i = 0; i < gameConfig.numRows; i++) {
    inserts.push({
      id: inserts.length, row: i,
      direction: 1, x: -1, y: i,
      rotation: 0, oppositeId: inserts.length + 1
    });
    inserts.push({
      id: inserts.length, row: i,
      direction: -1, x: gameConfig.numCols, y: i,
      rotation: 180, oppositeId: inserts.length - 1
    });
  }

  createTileElements(tiles);
  createInsertElements(inserts);
}


console.log('buildBoard loaded');

loadConfigFromStorage();
populateUiSettingsFromConfig();
rebuildBoard();


