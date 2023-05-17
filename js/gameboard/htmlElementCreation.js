'use strict';

const gameboardElement = document.getElementById("gameboard");

function clearGameboardElement() {
  while (gameboardElement.hasChildNodes()) {
    gameboardElement.removeChild(gameboardElement.firstChild)
  }
}

function updateTileElement(el, tile) {
  if (el === null) el = document.getElementById('tile' + tile.id);
  // el.style.height = `${gameConfig.tileHeight}rem`;
  // el.style.width = `${gameConfig.tileWidth}rem`;
  el.style.top = `${tile.y * gameConfig.tileHeight}rem`;
  el.style.left = `${tile.x * gameConfig.tileWidth}rem`;

  el.style.rotate = tile.rotation + 'deg';

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
    el.classList.add('tile-road-tiles');
    el.classList.add(tileTypes[tile.type]);
    el.id = 'tile' + tile.id;
    updateTileElement(el, tile);
    fragment.appendChild(el);
    el.onclick = (e) => {
      document.dispatchEvent(new CustomEvent('tile-clicked', {detail: {tile}}));
    };
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

  el.title = JSON.stringify(insert);
}

function createInsertElements(insertsList) {
  const fragment = document.createDocumentFragment();

  for (const insert of insertsList) {
    const el = document.createElement("button");
    el.classList.add('insert');
    el.id = 'insert' + insert.id;
    const icon = document.createElement("i");
    applyInsertIcon(icon, insert.rotation);

    el.appendChild(icon);
    updateInsertElement(el, icon, insert);
    el.onclick = (e) => {
      document.dispatchEvent(new CustomEvent('insert-clicked', {detail: {insert}}));
    };
    gameboardElement.appendChild(el);
  }

  gameboardElement.appendChild(fragment);
}

function applyInsertIcon(iconEl, rotation) {
  iconEl.classList.add("material-icons");
  iconEl.innerText = 'double_arrow';
  iconEl.style.rotate = rotation + 'deg';
}
