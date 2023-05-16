'use strict';

// controls when player is moving their tile
function controllerMoveTile(e) {
  switch (e.code) {
    case 'ArrowUp':
    case 'KeyW':
      if ([-1, gameConfig.numCols].indexOf(gameState.activeTile.x) !== -1
        && utils.between(-1, gameState.activeTile.y, gameConfig.numRows + 1)) {
        moveTileTo(gameState.activeTile, gameState.activeTile.x,
          gameState.activeTile.y - 1, 1000);
      }
      break;
    case 'ArrowDown':
    case 'KeyS':
      if ([-1, gameConfig.numCols].indexOf(gameState.activeTile.x) !== -1
        && utils.between(-2, gameState.activeTile.y, gameConfig.numRows)) {
        moveTileTo(gameState.activeTile, gameState.activeTile.x,
          gameState.activeTile.y + 1, 1000);
      }
      break;
    case 'ArrowLeft':
    case 'KeyA':
      if ([-1, gameConfig.numRows].indexOf(gameState.activeTile.y) !== -1
        && utils.between(-1, gameState.activeTile.x, gameConfig.numCols + 1)) {
        moveTileTo(gameState.activeTile, gameState.activeTile.x - 1,
          gameState.activeTile.y, 1000);
      }
      break;
    case 'ArrowRight':
    case 'KeyD':
      if ([-1, gameConfig.numRows].indexOf(gameState.activeTile.y) !== -1
        && utils.between(-2, gameState.activeTile.x, gameConfig.numCols)) {
        moveTileTo(gameState.activeTile, gameState.activeTile.x + 1,
          gameState.activeTile.y, 1000);
      }
      break;
    case 'KeyQ':
    case 'Comma':
      rotateTileBy(gameState.activeTile, -90);
      break;
    case 'KeyE':
    case 'Period':
      rotateTileBy(gameState.activeTile, 90);
      break;
    case 'Space':
      triggerInsertClickedByXY(gameState.activeTile.x, gameState.activeTile.y);
      break;
  }
}

function controllerMoveCharacter(e) {
  switch (e.code) {
    case 'ArrowUp':
    case 'KeyW':
      movePlayerBy(gameState.activePlayer, 0, -1);
      break;
    case 'ArrowDown':
    case 'KeyS':
      movePlayerBy(gameState.activePlayer, 0, 1);
      break;
    case 'ArrowLeft':
    case 'KeyA':
      movePlayerBy(gameState.activePlayer, -1, 0);
      break;
    case 'ArrowRight':
    case 'KeyD':
      movePlayerBy(gameState.activePlayer, 1, 0);
      break;
    case 'Space':
      nextPlayerStep();
      break;
  }
}


document.addEventListener('keydown', (e) => {
  if (!gameState.settingsExpanded) {
    console.log(e.code);

    if (gameState.activePlayerStep === ACTIVE_PLAYER_STEPS.INSERT_TILE) {
      controllerMoveTile(e);
    } else if (gameState.activePlayerStep === ACTIVE_PLAYER_STEPS.MOVE_CHARACTER) {
      controllerMoveCharacter(e);
    }
    //generic controls regardless of player step
    switch (e.code) {
      case 'Tab':
        //prevent tabbing thru everything
        e.stopPropagation();
        e.preventDefault();
        break;
    }
  }
})
