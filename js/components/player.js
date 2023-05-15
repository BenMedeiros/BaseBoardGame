'use strict';

// scoreboard
function setPlayerCount() {
  const el = document.getElementById('player-count');
  el.innerText = players.length + '';
}

//creates player character element
function createPlayerCharacterElement(player) {
  const el = document.createElement('img');
  el.id = player.elId_playerCharacter;
  el.classList.add('player-character');
  el.src = player.gamepiece;

  //make character slightly smaller than tile
  el.style.maxHeight = `${gameConfig.tileHeight * gameConfigStatic.playerCharacterScale}rem`;
  el.style.maxWidth = `${gameConfig.tileWidth * gameConfigStatic.playerCharacterScale}rem`;
  //offset player by the shrinkage to center them
  el.style.paddingBlock = `${gameConfig.tileHeight * (1 - gameConfigStatic.playerCharacterScale) / 2}rem`;
  el.style.paddingInline = `${gameConfig.tileWidth * (1 - gameConfigStatic.playerCharacterScale) / 2}rem`;
  //player location
  el.style.top = `${(player.y) * gameConfig.tileHeight}rem`;
  el.style.left = `${player.x * gameConfig.tileWidth}rem`;

  gameboardElement.appendChild(el);
}

// uses player x/y
function movePlayerElement(player) {
  const el = document.getElementById(player.elId_playerCharacter);
  el.style.top = `${player.y * gameConfig.tileHeight}rem`;
  el.style.left = `${player.x * gameConfig.tileWidth}rem`;
}

function createPlayerElement(player) {
  const playerBox = document.createElement('span');
  playerBox.classList.add('player-box');

  const nameEl = document.createElement('p');
  nameEl.id = player.elId_playerName;
  nameEl.classList.add('player-name');
  nameEl.innerText = player.name;

  const innerEl = document.createElement('span');
  innerEl.id = player.elId_playerScore;
  innerEl.classList.add('player-score');
  innerEl.innerText = player.score;

  const progressEl = document.createElement('progress');
  progressEl.id = player.elId_playerStatus;
  progressEl.classList.add('player-status');
  progressEl.max = Object.keys(ACTIVE_PLAYER_STEPS).length - 1;
  progressEl.value = ACTIVE_PLAYER_STEPS.INACTIVE;

  const iconEl = document.createElement('img');
  iconEl.id = player.elId_playerIcon;
  iconEl.classList.add('player-icon');
  iconEl.src = player.icon;

  playerBox.appendChild(iconEl);
  playerBox.appendChild(nameEl);
  nameEl.appendChild(innerEl);
  nameEl.appendChild(progressEl);

  document.getElementById('scoreboard').appendChild(playerBox);
  setPlayerCount();
}

function updatePlayerStatusElements(player) {
  if(!player) return;
  const playerStatusEl = document.getElementById(player.elId_playerStatus);
  const playerBoxEl = playerStatusEl.parentElement.parentElement;

  if (gameState.activePlayerId === player.id) {
    playerStatusEl.value = gameState.activePlayerStep;
    playerBoxEl.classList.add('active-player');
  } else {
    playerStatusEl.value = ACTIVE_PLAYER_STEPS.INACTIVE;
    playerBoxEl.classList.remove('active-player');
  }
}
