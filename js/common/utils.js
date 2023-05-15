const utils = {};

//random from min to max inclusive
utils.randomInt = (min = 0, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

utils.randomFrom = (enumList) => {
  return enumList[utils.randomInt(0, enumList.length -1)];
}

utils.between =  (low, med, high) => {
  return low < med && med < high;
}

utils.randomizeArray = (arr) => {
  return arr.sort((a, b) => 0.5 - Math.random());
}
