/*
  GAMEBOARD MODULE
*/
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

  const placeMarker = (row, column, marker) => {
    let gameboardRowIndex = row - 1;
    let gameboardColumnIndex = column - 1;

    if (gameboard[gameboardRowIndex][gameboardColumnIndex] === " ") {
      gameboard[gameboardRowIndex][gameboardColumnIndex] = marker;
    } else {
      console.log("Space already occupied");
    }
  };

  const displayGameboard = () => {
    console.log(gameboard);
  };

  return { placeMarker: placeMarker, displayGameboard: displayGameboard };
})();

/* 
  PLAYER MODULE
*/
const players = (function () {
  let players = [
    { playerName: "player1", playerScore: 0, marker: "X" },
    { playerName: "player2", playerScore: 0, marker: "O" },
  ];

  const getPlayerIndexFromName = (playerName) => {
    return players.findIndex((player) => player.playerName === playerName);
  };

  const increasePlayerScore = (playerName) => {
    players[getPlayerIndexFromName(playerName)].playerScore += 1;
  };

  const setPlayerName = (currentName, newName) => {
    players[getPlayerIndexFromName(currentName)].playerName = newName;
  };

  const displayPlayers = () => {
    console.log(players);
  };

  return {
    displayPlayers: displayPlayers,
    increasePlayerScore: increasePlayerScore,
    setPlayerName: setPlayerName,
  };
})();
