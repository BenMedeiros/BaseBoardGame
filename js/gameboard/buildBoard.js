'use strict';

function getRandomTileType() {
  return Object.keys(tileTypes)[utils.randomInt(0, Object.keys(tileTypes).length - 1)];
}


function spawnPlayers() {
  if (players.length > 4) throw new Error('4 players max, TODO add more spawn points');

  const spawnPoints = utils.randomizeArray([
    {x: 0, y: 0},
    {x: 0, y: gameConfig.numRows - 1},
    {x: gameConfig.numCols - 1, y: 0},
    {x: gameConfig.numCols - 1, y: gameConfig.numRows - 1},
  ]);

  for (let i = 0; i < players.length; i++) {
    createPlayerCharacterElement(players[i]);
    updatePlayerStatusElements(players[i]);
    movePlayer(players[i], -1, i);
    setTimeout(() => {
      movePlayer(players[i], spawnPoints[i].x, spawnPoints[i].y);
    }, Math.random() * 2000);
  }
}

//build board, populate tiles, and set the initial tile postitions
function rebuildBoard() {
  console.log('rebuildBoard');
  clearGameboardElement();

  gameState.settingsExpanded = true;
  gameState.activeTileId = 0;
  gameState.activeTileIdHistory = [];
  gameState.disabledInsertId = null;

  spawnPlayers();

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


