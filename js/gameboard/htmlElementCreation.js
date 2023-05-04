'use strict';

const gameboardElement = document.getElementById("gameboard");

function updateGameboardElement() {
  gameboardElement.style.width = gameConfig.boardWidth + 'rem';
  gameboardElement.style.height = gameConfig.boardHeight + 'rem';
}

function clearGameboardElement() {
  while (gameboardElement.hasChildNodes()) {
    gameboardElement.removeChild(gameboardElement.firstChild)
  }
}

function updateTileElement(el, tile) {
  if (el === null) el = document.getElementById('tile' + tile.id);
  el.style.height = `${gameConfig.tileHeight}rem`;
  el.style.width = `${gameConfig.tileWidth}rem`;
  el.style.top = `${tile.y * gameConfig.tileHeight}rem`;
  el.style.left = `${tile.x * gameConfig.tileWidth}rem`;

  el.innerHTML = `${tile.id}: <br/>(${tile.x}, ${tile.y})`;
  el.onclick = tileClicked;
}

function createTileElement(tile) {
  const el = document.createElement("button");
  el.classList.add('tile');
  el.id = 'tile' + tile.id;
  updateTileElement(el, tile);
  gameboardElement.appendChild(el);
}

function updateInsertElement(el, insert) {
  el.style.height = `${gameConfig.tileHeight / 2}rem`;
  el.style.width = `${gameConfig.tileWidth / 2}rem`;
  //put on sides of row
  if (insert.row !== undefined) {
    el.style.top = `${(insert.row + .25) * gameConfig.tileHeight}rem`;
    if (insert.direction > 0) {
      el.style.left = `${gameConfig.tileWidth / -2}rem`;
    } else {
      el.style.left = `${gameConfig.boardWidth}rem`;
    }
  }
  //put on top/bottom of col
  if (insert.col !== undefined) {
    el.style.left = `${(insert.col + .25) * gameConfig.tileWidth}rem`;
    if (insert.direction > 0) {
      el.style.top = `${gameConfig.tileHeight / -2}rem`;
    } else {
      el.style.top = `${gameConfig.boardHeight}rem`;
    }
  }

  el.innerHTML = JSON.stringify(insert);
  el.onclick = insertClicked;
}

function createInsertElement(insert) {
  const el = document.createElement("button");
  el.classList.add('insert');
  el.id = 'insert' + insert.id;
  updateInsertElement(el, insert);
  gameboardElement.appendChild(el);
}

