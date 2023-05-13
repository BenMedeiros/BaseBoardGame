'use strict';

//adds a temp css transition class and removes it when complete;
//needed so that user resize:both isn't isn't animated
function addTempTransitionClass(el, cssClassName) {
  el.classList.add(cssClassName);
  Promise.allSettled(el.getAnimations().map(ani => ani.finished)).then(() => {
    el.classList.remove(cssClassName);
    console.log(cssClassName + ' done');
  })
}

function collapseSettingElement(event) {
  // console.log('collpase-click', event);
  if (gameState.settingsExpanded) {
    const gameConfigEl = document.querySelector('.collapsible');
    gameState.settingsExpanded = false;
    if (!gameConfigEl.classList.contains('collapsed')) {
      gameConfigEl.classList.add('collapsed');
      gameConfigEl.classList.remove('expanded');
      addTempTransitionClass(gameConfigEl, 'collapsing');
    }
  }
}

function expandSettingElement(event) {
  // console.log('expand-click', event);
  event.stopPropagation();
  if (!gameState.settingsExpanded) {
    const gameConfigEl = document.querySelector('.collapsible');
    gameState.settingsExpanded = true;
    if (gameConfigEl.classList.contains('collapsed')) {
      gameConfigEl.classList.remove('collapsed');
      gameConfigEl.classList.add('expanded');
      addTempTransitionClass(gameConfigEl, 'expanding');
    }
  }
}


const gameConfigEl = document.getElementById('gameConfig');
document.addEventListener('click', collapseSettingElement);
gameConfigEl.addEventListener('click', expandSettingElement);
