'use strict';

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

  gameState.settingsExpanded = true;
  gameState.activeTileId = 0;
  gameState.activeTileIdHistory = [];
  gameState.disabledInsertId = null;

  spawnPlayers();
  deleteAllTiles();
  const tile0 = createTile();

  for (let x = 0; x < gameConfig.numCols; x++) {
    for (let y = 0; y < gameConfig.numRows; y++) {
      //option to spawn tiles as if you were scattering them
      if (gameConfig.animateStart) {
        const tile = createTile();
        setTimeout(() => {
          tile.x = x;
          tile.y = y;
          tile.rotation = utils.randomFrom([0, 90, 180, 270, 360, -90, -180, -270]);
        }, 1000 * Math.random());
      } else {
        const tile = createTile();
      }
    }
  }
  //build the control buttons/inserts
  inserts.length = 0;
  for (let i = 0; i < gameConfig.numCols; i++) {
    createInsert(i, -1, 90, inserts.length + 1);
    createInsert(i, gameConfig.numRows, -90, inserts.length - 1);
  }
  for (let i = 0; i < gameConfig.numRows; i++) {
    createInsert(-1, i, 0, inserts.length + 1);
    createInsert(gameConfig.numCols, i, 180, inserts.length - 1);
  }

  createTileElements(tiles);
  createInsertElements(inserts);
  tiles[0].isActiveTile = true;

  setTimeout(setNextPlayerActive, 1000);


}


console.log('buildBoard loaded');

loadConfigFromStorage();
populateUiSettingsFromConfig();
rebuildBoard();


