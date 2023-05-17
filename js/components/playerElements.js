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
  console.log('character el created ', player.id, player.name);
}

// uses player x/y
function movePlayerCharacterElement(player) {
  const el = document.getElementById(player.elId_playerCharacter);
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
  playerBox.id = player.elId_playerBox;

  const iconEl = document.createElement('img');
  iconEl.id = player.elId_playerIcon;
  iconEl.classList.add('player-icon');
  iconEl.src = player.icon;
  iconEl.style.setProperty('--iconFilter', player.iconFilter);
  playerBox.appendChild(iconEl);

  const nameEl = document.createElement('p');
  nameEl.id = player.elId_playerName;
  nameEl.classList.add('player-name');
  nameEl.innerText = player.name;
  playerBox.appendChild(nameEl);

  const scoreEl = document.createElement('span');
  scoreEl.id = player.elId_playerScore;
  scoreEl.classList.add('player-score');
  scoreEl.innerText = player.score;
  nameEl.appendChild(scoreEl);

  const progressEl = document.createElement('progress');
  progressEl.id = player.elId_playerStatus;
  progressEl.classList.add('player-status');
  progressEl.max = Object.keys(ACTIVE_PLAYER_STEPS).length - 1;
  progressEl.value = player.playerStep;
  nameEl.appendChild(progressEl);

  const msgEl = document.createElement('span');
  msgEl.id = player.elId_playerMessage;
  msgEl.classList.add('player-message');
  msgEl.innerText = ACTIVE_PLAYER_STEPS.getStringOf(player.playerStep);
  nameEl.appendChild(msgEl);

  document.getElementById('scoreboard').appendChild(playerBox);
  setPlayerCount();
}

function updatePlayerStatusElements(player) {
  if (!player) return;
  const playerCharacterEl = document.getElementById(player.elId_playerCharacter);
  const playerStatusEl = document.getElementById(player.elId_playerStatus);
  const playerMsgEl = document.getElementById(player.elId_playerMessage);
  const playerBoxEl = document.getElementById(player.elId_playerBox);

  playerStatusEl.value = player.playerStep;
  playerMsgEl.innerText = ACTIVE_PLAYER_STEPS.getStringOf(player.playerStep);
  if (gameState.activePlayerId === player.id) {
    playerBoxEl.classList.add('active');
    playerCharacterEl.style.setProperty('--is-active-player', '1');

    playerBoxEl.style.setProperty('--is-active-player', '1');

  } else {
    playerBoxEl.classList.remove('active');
    playerBoxEl.style.removeProperty('--is-active-player');
    playerCharacterEl.style.removeProperty('--is-active-player');

  }
}
