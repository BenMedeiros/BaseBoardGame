'use strict';

const players = [];

function addPlayer(name) {
  const player = {
    id: players.length,
    name,
    score: 0,
    icon: '/img/gengar_action_figure.png',
    gamepiece : '/img/gengar_action_figure.png',
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
      },
    },
    elId_playerIcon: {
      get() {
        return 'player-icon' + this.id
      },
    }
  });

  players.push(player);
  createPlayerElement(player);
  return player;
}

function setPlayerActive(player) {
  const oldActivePlayer = gameState.activePlayer;
  gameState.activePlayerId = player.id;
  gameState.activePlayerStep = ACTIVE_PLAYER_STEPS.INSERT_TILE;
  if(oldActivePlayer && player.id !== oldActivePlayer.id) updatePlayerStatusElements(oldActivePlayer);
  updatePlayerStatusElements(player);

 console.log('setplayeractive');
  enableTempDisabledInserts();
}

function setNextPlayerActive() {
  setPlayerActive(players[(gameState.activePlayerId + 1) % players.length]);
}

function nextPlayerStep() {
  if (gameState.activePlayerStep === Object.keys(ACTIVE_PLAYER_STEPS).length - 1) {
    setNextPlayerActive();
  } else {
    gameState.activePlayerStep++;
    updatePlayerStatusElements(gameState.activePlayer);
    tempDisableAllInserts();
  }
}

function movePlayer(player, x, y) {
  player.x = x;
  player.y = y;
  movePlayerElement(player);
}

addPlayer('Ben');
addPlayer('Sadaf');
addPlayer('player 3');
setPlayerActive(players[utils.randomInt(0, players.length - 1)]);

document.addEventListener('insert-clicked-success', nextPlayerStep);
