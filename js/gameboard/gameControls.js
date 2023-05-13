'use strict';


document.addEventListener('keydown', (e) => {
  if (!gameState.settingsExpanded) {
    console.log(e.code);

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
      case 'Tab':
        //prevent tabbing thru everything
        e.stopPropagation();
        e.preventDefault();
        break;
    }

  }
})
