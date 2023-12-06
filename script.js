const gameboard = (function () {
  const gameboard = [];
  const rows = 3;
  const columns = 3;

  // create 3x3 gameboard
  for (let i = 0; i < rows; i++) {
    gameboard[i] = [];
    for (let j = 0; j < columns; j++) {
      gameboard[i][j] = " ";
    }
  }

  function placeMarker(row, column, marker) {
    let gameboardRowIndex = row - 1;
    let gameboardColumnIndex = column - 1;

    if (gameboard[gameboardRowIndex][gameboardColumnIndex] === " ") {
      gameboard[gameboardRowIndex][gameboardColumnIndex] = marker;
    } else {
      console.log("Space already occupied");
    }
  }

  function displayGameboard() {
    console.log(gameboard);
  }

  return { placeMarker: placeMarker, displayGameboard: displayGameboard };
})();
