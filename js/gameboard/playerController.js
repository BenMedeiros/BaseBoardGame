'use strict';

const players = [];

const ACTIVE_PLAYER_STEPS = {
  INACTIVE: 0,
  INSERT_TILE: 1,
  MOVE_CHARACTER: 2,
  DONE: 3,
  getStringOf: (ind) => {
    for (const [stepString, stepValue] of Object.entries(ACTIVE_PLAYER_STEPS)) {
      if (stepValue === ind) return stepString;
    }
  }
};

Object.defineProperty(ACTIVE_PLAYER_STEPS,'getStringOf',{enumerable:false});
Object.seal(ACTIVE_PLAYER_STEPS);

function addPlayer(name, imageFilter) {
  const player = {
    id: players.length,
    name,
    score: 0,
    icon: 'img/gengar_action_figure.png',
    gamepiece: 'img/gengar_action_figure.png',
    iconFilter: imageFilter,
    gamepieceFilter: imageFilter,
    x: -1,
    y: -1,
    //null - not shared, else what position they occupy on the tile
    sharedTilePosition: 0,
    sharedTiles: 0,
    playerStep : 0
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
    elId_playerMessage: {
      get() {
        return 'player-message' + this.id
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
  return Object.seal(player);
}

function setPlayerActive(player) {
  const oldActivePlayer = gameState.activePlayer;
  gameState.activePlayer = player;
  if(oldActivePlayer && player.id !== oldActivePlayer.id){
    oldActivePlayer.playerStep = ACTIVE_PLAYER_STEPS.INACTIVE;
    updatePlayerStatusElements(oldActivePlayer);
  }
  player.playerStep = ACTIVE_PLAYER_STEPS.INSERT_TILE;
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
    setNextPlayerActive()
    //  last step just in case i want a hook later
  } else if (gameState.activePlayerStep === ACTIVE_PLAYER_STEPS.DONE) {
    updatePlayerStatusElements(gameState.activePlayer);
    setTimeout(nextPlayerStep, 1000);
  } else {
    updatePlayerStatusElements(gameState.activePlayer);
    tempDisableAllInserts();
  }
}

function movePlayer(player, x, y) {
  player.x = x;
  player.y = y;

  const xyPlayerMap = {};
  for (const plyr of players) {
    const key = `(${plyr.x},${plyr.y})`;
    if (!xyPlayerMap[key]) xyPlayerMap[key] = []
    xyPlayerMap[key].push(plyr);
  }
  //note if any x/y aka tiles are shared
  for (const sharedTilePlayersArray of Object.values(xyPlayerMap)) {
    for (let i = 0; i < sharedTilePlayersArray.length; i++) {
      const pl = sharedTilePlayersArray[i];
      //one player moves at a time, so the count would change for anyone affected
      if(pl.sharedTiles !== sharedTilePlayersArray.length) {
        pl.sharedTilePosition = i;
        pl.sharedTiles = sharedTilePlayersArray.length;
        updatePlayerCharacterElementOffset(pl)
      }
    }
  }

  movePlayerCharacterElement(player);
}

function movePlayerBy(player, x, y) {
  if (areTilesConnectedAdjacent(getTileByXY(player.x, player.y), getTileByXY(player.x + x, player.y + y))) {
    movePlayer(player, player.x + x, player.y + y);
  } else {
    console.log('tiles not connected');
  }
}

addPlayer('Ben', null);
addPlayer('Sadaf', 'hue-rotate(110deg) saturate(1.3)');
addPlayer('player 3', 'hue-rotate(210deg)');
addPlayer('Frank', 'hue-rotate(40deg)');

setPlayerActive(players[utils.randomInt(0, players.length - 1)]);

document.addEventListener('insert-clicked-success', nextPlayerStep);
