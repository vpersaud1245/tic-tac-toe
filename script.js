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

  const isCellEmpty = (row, column) => {
    let gameboardRowIndex = row - 1;
    let gameboardColumnIndex = column - 1;
    if (gameboard[gameboardRowIndex][gameboardColumnIndex] === " ") {
      return true;
    } else {
      return false;
    }
  };

  // for bot use
  const getAvailableMoves = () => {
    let availableMoves = [];
    for (let i = 1; i <= rows; i++) {
      for (let j = 1; j <= columns; j++) {
        if (isCellEmpty(i, j)) {
          availableMoves.push(`${i}_${j}`);
        }
      }
    }
    return availableMoves;
  };

  const placeMarker = (row, column, marker) => {
    let gameboardRowIndex = row - 1;
    let gameboardColumnIndex = column - 1;

    if (isCellEmpty(row, column)) {
      gameboard[gameboardRowIndex][gameboardColumnIndex] = marker;
    } else {
      console.log("Space already occupied");
    }
  };

  const checkForWin = () => {
    // Check Rows
    for (let i = 0; i < rows; i++) {
      let winFoundRow = gameboard[i].every(
        (mark) => mark != " " && mark === gameboard[i][0]
      );
      if (winFoundRow) {
        console.log("row"); // for Testing
        return winFoundRow;
      }
    }
    // Check columns
    let winFoundColumn = false;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (i > 0 && gameboard[0][j] != " ") {
          if (
            gameboard[0][j] === gameboard[1][j] &&
            gameboard[0][j] === gameboard[2][j]
          ) {
            winFoundColumn = true;
            console.log("column"); // for Testing
            return winFoundColumn;
          }
        }
      }
    }
    // Check diagonals
    let winFoundDiagonal = false;
    if (gameboard[0][0] != " ") {
      if (
        gameboard[1][1] === gameboard[0][0] &&
        gameboard[2][2] == gameboard[0][0]
      ) {
        winFoundDiagonal = true;
        console.log("win diagonal left-right"); // for Testing
        return winFoundDiagonal;
      }
    } else if (gameboard[0][2] != " " && winFoundDiagonal === false) {
      if (
        gameboard[0][2] === gameboard[1][1] &&
        gameboard[0][2] === gameboard[2][0]
      ) {
        winFoundDiagonal = true;
        console.log("win diagonal right-left"); // for Testing
        return winFoundDiagonal;
      }
    }
  };

  const displayGameboard = () => {
    console.log(gameboard);
  };

  return {
    placeMarker: placeMarker,
    displayGameboard: displayGameboard,
    checkForWin: checkForWin,
    isCellEmpty: isCellEmpty, // for testing
    getAvailableMoves,
    getAvailableMoves,
  };
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
    let playerIndex = getPlayerIndexFromName(playerName);
    players[playerIndex].playerScore++;
  };

  const setPlayerName = (currentName, newName) => {
    let playerIndex = getPlayerIndexFromName(currentName);
    players[playerIndex].playerName = newName;
  };

  const getWinningPlayerName = (marker) => {
    return players.find((player) => player.marker === marker).playerName;
  };

  const displayPlayers = () => {
    console.log(players);
  };

  return {
    displayPlayers: displayPlayers,
    increasePlayerScore: increasePlayerScore,
    setPlayerName: setPlayerName,
    getWinningPlayerName: getWinningPlayerName,
  };
})();

/*
GAME CONTROLLER
*/
const gameController = (function () {
  let playerTurn = "X";

  // Cache DOM
  const gameboardCells = document.querySelectorAll(".gameboard > div");
  const gameboardElement = document.querySelector(".gameboard");
  const gameoverMessage = document.querySelector(".gameover");

  const switchPlayerTurn = () => {
    if (playerTurn === "X") {
      playerTurn = "O";
    } else {
      playerTurn = "X";
    }
  };

  const displayPlayerTurn = () => {
    // for Testing
    console.log(playerTurn);
  };

  const displayGameoverMessage = () => {
    gameboardElement.style.backgroundColor = "gray";
    gameboardElement.style.pointerEvents = "none";
    gameoverMessage.style.display = "grid";
  };

  const playGame = () => {
    let turnCount = 1;
    gameboardCells.forEach((cell) => {
      cell.addEventListener("click", (e) => {
        if (e.target.textContent === "") {
          e.target.textContent = playerTurn;
          let row = e.target.className.charAt(0);
          let column = e.target.className.charAt(2);
          gameboard.placeMarker(row, column, playerTurn);
          gameboard.displayGameboard(); // for Testing
          turnCount++;
          console.log(`Turn: ${turnCount}`); // for Testing
          if (gameboard.checkForWin()) {
            let winner = players.getWinningPlayerName(playerTurn);
            players.increasePlayerScore(winner);
            displayGameoverMessage();
            gameoverMessage.textContent = `${winner} Wins!`;
          } else if (turnCount === 10) {
            displayGameoverMessage();
            gameoverMessage.textContent = "Its a tie";
          }
          switchPlayerTurn();
        }
      });
    });
  };

  return {
    displayPlayerTurn: displayPlayerTurn,
    switchPlayerTurn: switchPlayerTurn,
    playGame: playGame,
  };
})();

gameController.playGame(); // Runs playGame function for PVP testing

/*
  BOT MODULE
*/
const bot = (function () {
  let botDifficulty = "easy";

  const getBotMove = () => {
    if (botDifficulty === "easy") {
      return easyBotMove();
    }
  };

  const getRandomMove = (allPossibleMoves) => {
    return allPossibleMoves[
      [Math.floor(Math.random() * allPossibleMoves.length)]
    ];
  };

  const easyBotMove = () => {
    // Will be in format "1_1"
    return getRandomMove(gameboard.getAvailableMoves());
  };

  return { getBotMove: getBotMove };

  // medium will block wins but other wise make an easy move
  // hard will always make the best move
})();

/*
TODO:
1. Add variable for e.target in playGame function to increase readability
2. Add feature to clear board.
 */
