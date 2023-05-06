'use strict';

document.addEventListener('keydown', (e) => {
  if (!gameState.settingsExpanded) {
    console.log(e.code);

    switch (e.code) {
      case 'ArrowUp':
        // up arrow
        break;
      case 'ArrowDown':
        // down arrow
        break;
      case 'ArrowLeft':
      case 'KeyQ':
        rotateTileBy(gameState.activeTile, -90);
        break;
      case 'ArrowRight':
      case 'KeyE':
        rotateTileBy(gameState.activeTile, 90);
    }

  }
})
