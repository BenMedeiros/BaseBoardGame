'use strict';

const players = [];

function addPlayer(name, imageFilter) {
  const player = {
    id: players.length,
    name,
    score: 0,
    icon: '/img/gengar_action_figure.png',
    gamepiece: '/img/gengar_action_figure.png',
    iconFilter: imageFilter,
    gamepieceFilter: imageFilter,
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
  if (oldActivePlayer && player.id !== oldActivePlayer.id) updatePlayerStatusElements(oldActivePlayer);
  updatePlayerStatusElements(player);
  enableTempDisabledInserts();
}

function setNextPlayerActive() {
  setPlayerActive(players[(gameState.activePlayerId + 1) % players.length]);
}

function nextPlayerStep() {
  gameState.activePlayerStep++;
  //completed all steps, next player
  if (gameState.activePlayerStep === Object.keys(ACTIVE_PLAYER_STEPS).length) {
    setNextPlayerActive();
    //  last step just in case i want a hook later
  } else if (gameState.activePlayerStep === ACTIVE_PLAYER_STEPS.DONE) {
    nextPlayerStep();
  } else {
    updatePlayerStatusElements(gameState.activePlayer);
    tempDisableAllInserts();
  }
}

function movePlayer(player, x, y) {
  player.x = x;
  player.y = y;
  movePlayerCharacterElement(player);
}

function movePlayerBy(player, x, y) {
  if (areTilesConnectedAdjacent(getTileByXY(player.x, player.y), getTileByXY(player.x + x, player.y + y))) {
    player.x += x;
    player.y += y;
    movePlayerCharacterElement(player);
  } else {
    console.log('tiles not connected');
  }
}

addPlayer('Ben', null);
addPlayer('Sadaf', 'hue-rotate(110deg) saturate(1.3)');
addPlayer('player 3', 'hue-rotate(210deg)');
setPlayerActive(players[utils.randomInt(0, players.length - 1)]);

document.addEventListener('insert-clicked-success', nextPlayerStep);
