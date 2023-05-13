'use strict';

const tiles = [];

const tileTypes = {
  plus: 'tile-plus',
  t: 'tile-t',
  straight: 'tile-straight',
  turn: 'tile-turn',
  end: 'tile-end'
}
//for each side of tile, is it a path
const tilePaths = {
  plus: [1, 1, 1, 1],
  t: [1, 1, 0, 1],
  straight: [0, 1, 0, 1],
  turn: [1, 1, 0, 0],
  end: [0, 1, 0, 0]
}

//return true if tiles are connected accounting for type/rotation
function areTilesConnectedAdjacent(tile1, tile2) {
  const xDistance = tile1.x - tile2.x;
  const yDistance = tile1.y - tile2.y;

  //rotation could be any magnitude and negative, convert to 0,1,2,3
  let tile1RotationIndex = ((tile1.rotation % 360) + 360) / 90;
  let tile2RotationIndex = ((tile2.rotation % 360) + 360) / 90;

  if (yDistance === 1 && xDistance === 0) {
    tile2RotationIndex += 2;
  } else if (yDistance === -1 && xDistance === 0) {
    tile1RotationIndex += 2
  } else if (xDistance === 1 && yDistance === 0) {
    tile1RotationIndex += 1;
    tile2RotationIndex += 3;
  } else if (xDistance === -1 && yDistance === 0) {
    tile1RotationIndex += 3;
    tile2RotationIndex += 1;
  }else{
    return false;
  }

  tile1RotationIndex %= 4;
  tile2RotationIndex %= 4;

  if (tilePaths[tile1.type][tile1RotationIndex] && tilePaths[tile2.type][tile2RotationIndex]) {
    return true;
  } else {
    return false;
  }
}
// gets possible connected paths, brute force
function getAllConnectedAdjacentTiles(thisTile){
  return tiles.filter(tile => areTilesConnectedAdjacent(tile, thisTile));
}
