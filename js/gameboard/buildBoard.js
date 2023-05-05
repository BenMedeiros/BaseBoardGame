'use strict';

//build board, populate tiles, and set the initial tile postitions
function rebuildBoard() {
  console.log('rebuildBoard');
  clearGameboardElement();
  updateGameboardElement();

  tiles.length = 0;
  tiles.push({id: 0, x: -1, y: -1, isActiveTile: true});
  for (let x = 0; x < gameConfig.numCols; x++) {
    for (let y = 0; y < gameConfig.numRows; y++) {
      //option to spawn tiles as if you were scattering them
      if (gameConfig.animateStart) {
        const tile = {
          id: tiles.length, x: -1, y: -1,
          rotation: utils.randomFrom([0, 90, 180, 270])
        };
        tiles.push(tile);
        setTimeout(() => {
          moveTileTo(tile, x, y, 2000 * Math.random());
        }, 1000 * Math.random());
      } else {
        tiles.push({id: tiles.length, x, y, rotation: utils.randomFrom([0, 90, 180, 270])});
      }
    }
  }
  //build the control buttons/inserts
  inserts.length = 0;
  for (let i = 0; i < gameConfig.numCols; i++) {
    inserts.push({
      id: inserts.length, col: i,
      direction: 1, x: i, y: -1
    });
    inserts.push({
      id: inserts.length, col: i,
      direction: -1, x: i, y: gameConfig.numCols
    });
  }
  for (let i = 0; i < gameConfig.numRows; i++) {
    inserts.push({
      id: inserts.length, row: i,
      direction: 1, x: -1, y: i
    });
    inserts.push({
      id: inserts.length, row: i,
      direction: -1, x: gameConfig.numCols, y: i
    });
  }

  createTileElements(tiles);
  createInsertElements(inserts);
}


console.log('buildBoard loaded');

loadConfigFromStorage();
populateUiSettingsFromConfig();
rebuildBoard();


