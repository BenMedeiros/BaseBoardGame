'use strict';

const players = [];

function addPlayer(name) {
  const player = {
    id: players.length,
    name,
    score: 0
  };
  players.push(player);
  const el = document.createElement('p');
  el.id = 'player' + player.id;
  el.classList.add('player');
  el.innerText = player.name;

  const innerEl = document.createElement('span');
  innerEl.id = 'player-score' + player.id;
  innerEl.classList.add('score');
  innerEl.innerText = player.score;
  el.appendChild(innerEl);

  document.getElementById('scoreboard').appendChild(el);
  return player;
}

function setPlayerActive(player) {
  const playerEls = document.getElementsByClassName('player');

  for (const playerEl of playerEls) {
    if (playerEl.id === 'player' + player.id) {
      playerEl.classList.add('active-player');
    } else {
      playerEl.classList.remove('active-player')
    }
  }

  gameState.activePlayerId = player.id;
}

addPlayer('Ben');
addPlayer('Sadaf');
addPlayer('player 3');
setPlayerActive(players[utils.randomInt(0, players.length - 1)]);

document.addEventListener('insert-clicked-success', e => {
  setPlayerActive(players[(gameState.activePlayerId + 1) % players.length]);
});
