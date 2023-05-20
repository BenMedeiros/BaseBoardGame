'use strict';

const playingCards = [];

function createPlayingCard(name, icon) {

  //temp for pokemon, need to remove or generalize
  const pokeNumber = icon.substr(-7,3);

  const playingCard = {
    id : playingCards.length,
    name,
    pokeNumber,
    icon,
    isFlipped: false
  }

  return playingCard;
}

const playerDrawerElement = document.getElementById("player-drawer");


function createPlayingCardElement(playingCard) {
  const cardEl = document.createElement("div");
  cardEl.id = playingCard.id;
  cardEl.classList.add('playing-card');

  const cardFrontEl = document.createElement("div");
  cardFrontEl.classList.add('playing-card-face');
  cardFrontEl.classList.add('playing-card-front');
  cardEl.appendChild(cardFrontEl);

  const frontImgEl = document.createElement("img");
  frontImgEl.src = playingCard.icon;
  cardFrontEl.appendChild(frontImgEl);

  const cardBackEl = document.createElement("div");
  cardBackEl.classList.add('playing-card-face');
  cardBackEl.classList.add('playing-card-back');
  cardEl.appendChild(cardBackEl);

  playerDrawerElement.appendChild(cardEl);
}


createPlayingCardElement(createPlayingCard('Bulbasaur', 'img/pokemon/catchable/001.png'));
createPlayingCardElement(createPlayingCard('Charmander', 'img/pokemon/catchable/004.png'));
createPlayingCardElement(createPlayingCard('Metapod', 'img/pokemon/catchable/011.png'));
createPlayingCardElement(createPlayingCard('Pikachu', 'img/pokemon/catchable/025.png'));
createPlayingCardElement(createPlayingCard('Raichu', 'img/pokemon/catchable/026.png'));
createPlayingCardElement(createPlayingCard('Diglett', 'img/pokemon/catchable/050.png'));
