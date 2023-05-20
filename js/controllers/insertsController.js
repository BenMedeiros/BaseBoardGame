'use strict';

const inserts = [];

function createInsert(x, y, rotation, oppositeId) {
  if (x === null || x === undefined) throw new Error('createInsert: x required');
  if (y === null || y === undefined) throw new Error('createInsert: y required');
  if (rotation === null || rotation === undefined) throw new Error('createInsert: rotation required');

  const insert = {
    id: inserts.length,
    x,
    y,
    rotation,
    oppositeId
  };

  Object.defineProperties(insert, {
    // identifies direction in sense of x or y
    direction: {
      get() {
        return [-180, -90, 180, 270].indexOf(this.rotation % 360) === -1;
      }
    },
    // y if a row, else undefined
    row: {
      get() {
        if(rotation % 180 === 0) return this.y;
      }
    },
    //  x if a col, else undefined
    col: {
      get(){
        if(Math.abs(rotation) % 180 === 90) return this.x;
      }
    }
  });

  inserts.push(insert);
  return insert;
}
