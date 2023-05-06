function disableInverseMove(insert) {
  console.log(insert, gameState.disabledInsert);
  disableInsert(inserts[insert.oppositeId]);
  if(gameState.disabledInsert) enableInsert(gameState.disabledInsert);
  gameState.disabledInsertId = insert.oppositeId;
}


document.addEventListener('insert-clicked', e => disableInverseMove(e.detail.insert));
