'use strict';


const playerDrawer = {
  collapsed : false
}


const playerDrawerElement = document.getElementById('player-drawer');
const playerDrawerControlElement = document.getElementById('player-drawer-control');

function toggleDrawer(force){
  if(force === undefined){
    playerDrawer.collapsed = !playerDrawer.collapsed;
  } else{
    playerDrawer.collapsed = force;
  }

  if(playerDrawer.collapsed){
    playerDrawerElement.classList.add('collapsed');
    playerDrawerControlElement.innerText = 'Expand Drawer';
  }else{
    playerDrawerElement.classList.remove('collapsed');
    playerDrawerControlElement.innerText = 'Collapse Drawer';
  }
}

toggleDrawer(true);
