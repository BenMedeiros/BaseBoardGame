'use strict';

async function updateBoard(event){
  readUiSettingsIntoConfig();
  saveConfigToStorage();
  // loadConfigFromStorage();
  rebuildBoard();
}

async function tileClicked(event){
  const tile = tiles[event.target.id.substr('tile'.length)];
  console.log('clicked', tile);
}

async function insertClicked(event){
  const insert = inserts[event.target.id.substr('insert'.length)];
  console.log('clicked', insert);
  if(insert.row !== undefined){
    moveRow(insert.row, insert.direction);
  }
  if(insert.col !== undefined){
    moveColumn(insert.col, insert.direction);
  }
  saveConfigToStorage();
}
