'use strict';

const players = [];

function setPlayerCount() {
  const el = document.getElementById('player-count');
  el.innerText = players.length + '';
}

function addPlayer(name) {
  const player = {
    id: players.length,
    name,
    score: 0,
    icon: '/img/gengar_action_figure.png',
    x: -1,
    y: -1
  };
  Object.defineProperties(player, {
    elId_playerName: {
      get() {
        return 'player-name' + this.id
      }
    },
    elId_playerScore: {
      get() {
        return 'player-score' + this.id
      }
    },
    elId_playerStatus: {
      get() {
        return 'player-status' + this.id
      }
    },
    elId_playerCharacter: {
      get() {
        return 'player-character' + this.id
      }
    }
  });

  players.push(player);

  const el = document.createElement('p');
  el.id = player.elId_playerName;
  el.classList.add('player-name');
  el.innerText = player.name;

  const innerEl = document.createElement('span');
  innerEl.id = player.elId_playerScore;
  innerEl.classList.add('player-score');
  innerEl.innerText = player.score;
  el.appendChild(innerEl);

  const statusEl = document.createElement('progress');
  statusEl.id = player.elId_playerStatus;
  statusEl.classList.add('player-status');
  statusEl.max = Object.keys(ACTIVE_PLAYER_STEPS).length - 1;
  statusEl.value = ACTIVE_PLAYER_STEPS.INACTIVE;
  el.appendChild(statusEl);

  document.getElementById('scoreboard').appendChild(el);
  setPlayerCount();
  return player;
}

function setPlayerActive(player) {
  const oldPlayerStatusEl = document.getElementById('player-status' + gameState.activePlayerId);
  if (oldPlayerStatusEl) {
    oldPlayerStatusEl.value = ACTIVE_PLAYER_STEPS.INACTIVE;
    oldPlayerStatusEl.parentElement.classList.remove('active-player');
  }

  gameState.activePlayerId = player.id;
  gameState.activePlayerStep = ACTIVE_PLAYER_STEPS.INSERT_TILE;
  updatePlayerStatusElement();
}

function updatePlayerStatusElement() {
  const playerStatusEl = document.getElementById('player-status' + gameState.activePlayerId);
  playerStatusEl.value = gameState.activePlayerStep;
  playerStatusEl.parentElement.classList.add('active-player');
}

function setNextPlayerActive() {
  setPlayerActive(players[(gameState.activePlayerId + 1) % players.length]);
}

function nextPlayerStep() {
  if (gameState.activePlayerStep === Object.keys(ACTIVE_PLAYER_STEPS).length - 1) {
    setNextPlayerActive();
  } else {
    gameState.activePlayerStep++;
    updatePlayerStatusElement();
  }
}

function movePlayer(player, x, y){
  player.x = x;
  player.y = y;
  movePlayerElement(player);
}

addPlayer('Ben');
addPlayer('Sadaf');
addPlayer('player 3');
setPlayerActive(players[utils.randomInt(0, players.length - 1)]);

document.addEventListener('insert-clicked-success', nextPlayerStep);
