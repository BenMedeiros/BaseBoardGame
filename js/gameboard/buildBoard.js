'use strict';

//build board, populate tiles, and set the initial tile postitions
function rebuildBoard() {
  console.log('rebuildBoard');
  clearGameboardElement();
  updateGameboardElement();

  tiles.length = 0;
  tiles.push({id :0, x : -1, y: -1, isActiveTile: true});
  for (let x = 0; x < gameConfig.numCols; x++) {
    for (let y = 0; y < gameConfig.numRows; y++) {
      const tile = {id: tiles.length, x, y};
      tiles.push(tile);
    }
  }
  //build the control buttons/inserts
  inserts.length = 0;
  for (let i = 0; i < gameConfig.numCols; i++) {
    const insert1 = {id: inserts.length, col: i, direction: 1};
    inserts.push(insert1);
    const insert2 = {id: inserts.length, col: i, direction: -1};
    inserts.push(insert2);
  }
  for (let i = 0; i < gameConfig.numRows; i++) {
    const insert1 = {id: inserts.length, row: i, direction: 1};
    inserts.push(insert1);
    const insert2 = {id: inserts.length, row: i, direction: -1};
    inserts.push(insert2);
  }

  createTileElements(tiles);
  createInsertElements(inserts);
}

function collapseSettingElement(event) {
  if (gameState.settingsExpanded) {
    const gameConfigEl = document.getElementById('gameConfig');
    gameState.settingsExpanded = false;
    if(!gameConfigEl.classList.contains('collapsed')) gameConfigEl.classList.add('collapsed')
  }
}

function expandSettingElement(event) {
  event.stopPropagation();
  if (!gameState.settingsExpanded) {
    const gameConfigEl = document.getElementById('gameConfig');
    gameState.settingsExpanded = true;
    if(gameConfigEl.classList.contains('collapsed')) gameConfigEl.classList.remove('collapsed');
  }
}


console.log('buildBoard loaded');

loadConfigFromStorage();
populateUiSettingsFromConfig();
rebuildBoard();

const gameConfigEl = document.getElementById('gameConfig');
document.addEventListener('click', collapseSettingElement);
gameConfigEl.addEventListener('click', expandSettingElement);


// for (let i = 0; i < 5; i++) {
//   setTimeout(moveRow.bind(null, 20,1), 200*i);
// }
