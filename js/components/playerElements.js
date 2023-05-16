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
  el.style.setProperty('--gamepieceFilter', player.gamepieceFilter);
  el.src = player.gamepiece;
  gameboardElement.appendChild(el);
}

// uses player x/y
function movePlayerCharacterElement(player) {
  const el = document.getElementById(player.elId_playerCharacter);
  // const topOffset = (1 - gameConfigStatic.playerCharacterScale) / 2;
  // const leftOffset = (1 - gameConfigStatic.playerCharacterScale) / 2;
  //player location
  // el.style.top = `${(player.y + topOffset) * gameConfig.tileHeight}rem`;
  // el.style.left = `${(player.x + leftOffset) * gameConfig.tileWidth}rem`;
  el.style.setProperty('--player-character-x', player.x);
  el.style.setProperty('--player-character-y', player.y);
}

//  update when players move on/off the same tile
function updatePlayerCharacterElementOffset(player) {
  const el = document.getElementById(player.elId_playerCharacter);
  if (!el) return;
  switch (player.sharedTiles) {
    case 3:
    case 4:
      el.style.translate = (player.sharedTilePosition % 2 - .5) * 2.5 + 'rem'
        + ' ' + (Math.floor(player.sharedTilePosition / 2) - .5) * 2.5 + 'rem';
      break;
    case 2:
      el.style.translate = (player.sharedTilePosition % 2 - .5) * 2.5 + 'rem';
      break;
    default:
      el.style.translate = '0';
  }
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
  iconEl.style.setProperty('--iconFilter', player.iconFilter);

  playerBox.appendChild(iconEl);
  playerBox.appendChild(nameEl);
  nameEl.appendChild(innerEl);
  nameEl.appendChild(progressEl);

  document.getElementById('scoreboard').appendChild(playerBox);
  setPlayerCount();
}

function updatePlayerStatusElements(player) {
  if (!player) return;
  const playerCharacterEl = document.getElementById(player.elId_playerCharacter);
  const playerStatusEl = document.getElementById(player.elId_playerStatus);
  const playerIconEl = document.getElementById(player.elId_playerIcon);
  const playerBoxEl = playerIconEl.parentElement;

  if (gameState.activePlayerId === player.id) {
    playerStatusEl.value = gameState.activePlayerStep;
    playerBoxEl.classList.add('active');
    playerIconEl.classList.add('active');
    if (playerCharacterEl) playerCharacterEl.classList.add('active');
  } else {
    playerStatusEl.value = ACTIVE_PLAYER_STEPS.INACTIVE;
    playerBoxEl.classList.remove('active');
    playerIconEl.classList.remove('active');
    if (playerCharacterEl) playerCharacterEl.classList.remove('active');
  }
}
