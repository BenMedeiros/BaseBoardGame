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
  console.log('updateTileElement', tile);
  if (el === null) el = document.getElementById('tile' + tile.id);
  el.style.height = `${gameConfig.tileHeight}rem`;
  el.style.width = `${gameConfig.tileWidth}rem`;
  el.style.top = `${tile.y * gameConfig.tileHeight}rem`;
  el.style.left = `${tile.x * gameConfig.tileWidth}rem`;

  if (tile.isActiveTile) {
    el.classList.add('active-tile');
  } else {
    el.classList.remove('active-tile');
  }

  el.title = JSON.stringify(tile);
  el.textContent = tile.id
}

function createTileElements(tilesList) {
  const fragment = document.createDocumentFragment();

  for (const tile of tilesList) {
    const el = document.createElement("button");
    el.classList.add('tile');
    el.id = 'tile' + tile.id;
    updateTileElement(el, tile);
    el.onclick = tileClicked;
    fragment.appendChild(el);
  }

  gameboardElement.appendChild(fragment);
}


function updateInsertElement(el, iconEl, insert) {
  el.style.height = `${gameConfig.tileHeight / 2}rem`;
  el.style.width = `${gameConfig.tileWidth / 2}rem`;
  //put on sides of row
  if (insert.row !== undefined) {
    el.style.top = `${(insert.row + .25) * gameConfig.tileHeight}rem`;
    if (insert.direction > 0) {
      el.style.left = `${gameConfig.tileWidth / -2}rem`;
      iconEl.classList.add("fa-circle-arrow-right");
    } else {
      el.style.left = `${gameConfig.boardWidth}rem`;
      iconEl.classList.add("fa-circle-arrow-left");
    }
  }

  //put on top/bottom of col
  if (insert.col !== undefined) {
    el.style.left = `${(insert.col + .25) * gameConfig.tileWidth}rem`;
    if (insert.direction > 0) {
      el.style.top = `${gameConfig.tileHeight / -2}rem`;
      iconEl.classList.add("fa-circle-arrow-down");
    } else {
      el.style.top = `${gameConfig.boardHeight}rem`;
      iconEl.classList.add("fa-circle-arrow-up");
    }
  }

  el.title = JSON.stringify(insert);
}

function createInsertElements(insertsList) {
  const fragment = document.createDocumentFragment();

  for (const insert of insertsList) {
    const el = document.createElement("button");
    el.classList.add('insert');
    el.id = 'insert' + insert.id;
    const icon = document.createElement("i");
    icon.classList.add("fa-solid");
    icon.classList.add("fa-xl");

    el.appendChild(icon);
    updateInsertElement(el, icon, insert);
    el.onclick = insertClicked.bind(null, insert);
    gameboardElement.appendChild(el);
  }

  gameboardElement.appendChild(fragment);
}
