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

  const clearGameBoard = () => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        gameboard[i][j] = " ";
      }
    }
  };

  const isCellEmpty = (row, column) => {
    let gameboardRowIndex = row - 1; // Turns row and column into array indices
    let gameboardColumnIndex = column - 1;
    if (gameboard[gameboardRowIndex][gameboardColumnIndex] === " ") {
      return true;
    } else {
      return false;
    }
  };

  // Used by hard bot to show all possible moves
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

  const removeMarker = (row, column) => {
    let gameboardRowIndex = row - 1; // Turns row and column into array indices
    let gameboardColumnIndex = column - 1;

    if (!isCellEmpty(row, column)) {
      gameboard[gameboardRowIndex][gameboardColumnIndex] = " ";
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
    }
    if (gameboard[0][2] != " " && winFoundDiagonal === false) {
      if (
        gameboard[0][2] === gameboard[1][1] &&
        gameboard[0][2] === gameboard[2][0]
      ) {
        winFoundDiagonal = true;
        console.log("win diagonal right-left"); // for Testing
        return winFoundDiagonal;
      }
    }
    return false;
  };

  const displayGameboard = () => {
    console.log(gameboard);
  };

  return {
    placeMarker: placeMarker,
    displayGameboard: displayGameboard,
    checkForWin: checkForWin,
    getAvailableMoves: getAvailableMoves,
    removeMarker: removeMarker,
    clearGameBoard: clearGameBoard,
    isCellEmpty: isCellEmpty,
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

  const getPlayerScore = (marker) => {
    return players.find((player) => player.marker === marker).playerScore;
  };

  const increasePlayerScore = (playerName) => {
    let playerIndex = getPlayerIndexFromName(playerName);
    players[playerIndex].playerScore++;
  };

  const resetScores = () => {
    players[0].playerScore = 0;
    players[1].playerScore = 0;
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
    getPlayerScore: getPlayerScore,
    resetScores: resetScores,
  };
})();

/*
GAME CONTROLLER
*/
const gameController = (function () {
  let playerTurn = "X";
  let startingPlayer = "X";

  // Cache DOM
  const gameboardCells = document.querySelectorAll(".gameboard > div");
  const gameboardElement = document.querySelector(".gameboard");
  const gameoverMessage = document.querySelector(".gameover-overlay");
  const player1Name = document.querySelector("#player1_name");
  const player2Name = document.querySelector("#player2_name");
  const player1Score = document.querySelector("#player1_score");
  const player2Score = document.querySelector("#player2_score");

  const switchPlayerTurn = () => {
    if (playerTurn === "X") {
      playerTurn = "O";
    } else {
      playerTurn = "X";
    }
  };

  const getPlayerTurn = () => {
    return playerTurn;
  };

  const toggleStartingPlayer = () => {
    startingPlayer = startingPlayer === "X" ? "O" : "X";
    playerTurn = startingPlayer; // Set the current player turn to the starting player
  };

  const displayGameoverMessage = () => {
    gameboardElement.style.backgroundColor = "gray";
    gameboardElement.style.pointerEvents = "none";
    gameoverMessage.style.display = "grid";
  };

  const removeGameoverMessage = () => {
    gameboardElement.style.backgroundColor = "white";
    gameboardElement.style.pointerEvents = "auto";
    gameoverMessage.style.display = "none";
  };

  const clearDisplayGameBoard = () => {
    gameboardCells.forEach((cell) => {
      cell.textContent = "";
    });
  };

  const displayPlayerScores = () => {
    player1Score.textContent = players.getPlayerScore("X");
    player2Score.textContent = players.getPlayerScore("O");
  };

  const playPlayerMove = (e) => {
    e.target.textContent = playerTurn;
    let row = e.target.className.charAt(0);
    let column = e.target.className.charAt(2);
    gameboard.placeMarker(row, column, playerTurn);
  };

  const playBotMove = (turn) => {
    let botMove = bot.getBotMove(turn);
    let row = botMove.charAt(0);
    let column = botMove.charAt(2);
    gameboard.placeMarker(row, column, playerTurn);
    gameboardCells.forEach((cell) => {
      if (cell.className === botMove) {
        cell.textContent = playerTurn;
      }
    });
  };

  const playGamePVP = () => {
    let turnCount = 1;
    gameboardCells.forEach((cell) => {
      cell.addEventListener("click", (e) => {
        if (e.target.textContent === "") {
          playPlayerMove(e);
          turnCount++;
          console.log(`Turn: ${turnCount}`); // for Testing
          if (gameboard.checkForWin()) {
            let winner = players.getWinningPlayerName(playerTurn);
            players.increasePlayerScore(winner);
            displayPlayerScores();
            displayGameoverMessage();
            gameoverMessage.textContent = `${winner} Wins!`;
            turnCount = 1;
            return;
          }
          // Check for tie
          else if (turnCount === 10) {
            displayGameoverMessage();
            gameoverMessage.textContent = "Its a tie";
            turnCount = 1;
            return;
          }
          switchPlayerTurn();
        }
      });
    });
  };

  const playGamePVB = () => {
    let turnCount = 1;
    // Makes bot move if bot goes first
    if (startingPlayer === "O" && turnCount === 1) {
      playBotMove(1);
      switchPlayerTurn();
    }
    gameboardCells.forEach((cell) => {
      cell.addEventListener("click", (e) => {
        if (e.target.textContent === "") {
          playPlayerMove(e);
          turnCount++;
          // Check for win of player
          if (gameboard.checkForWin()) {
            let winner = players.getWinningPlayerName(playerTurn);
            players.increasePlayerScore(winner);
            displayPlayerScores();
            displayGameoverMessage();
            gameoverMessage.textContent = `${winner} Wins!`;
            turnCount = 1;
            return;
          }
          switchPlayerTurn();
          // Displays tie if player goes first
          if (turnCount === 10) {
            displayGameoverMessage();
            gameoverMessage.textContent = "Its a tie";
            turnCount = 1;
            return;
          }
          setTimeout(() => {
            playBotMove(turnCount);
            turnCount++;
            // Displays tie if bot goes first
            if (startingPlayer === "O" && turnCount === 9) {
              displayGameoverMessage();
              gameoverMessage.textContent = "Its a tie";
              turnCount = 1;
              return;
            }
            // Check for win of bot
            if (gameboard.checkForWin()) {
              let winner = players.getWinningPlayerName(playerTurn);
              players.increasePlayerScore(winner);
              displayPlayerScores();
              displayGameoverMessage();
              gameoverMessage.textContent = `${winner} Wins!`;
              turnCount = 1;
              return;
            }
            switchPlayerTurn();
          }, 300);
        }
      });
    });
  };

  return {
    switchPlayerTurn: switchPlayerTurn,
    playGamePVP: playGamePVP,
    getPlayerTurn: getPlayerTurn,
    removeGameoverMessage: removeGameoverMessage,
    clearDisplayGameBoard: clearDisplayGameBoard,
    toggleStartingPlayer: toggleStartingPlayer,
    playGamePVB: playGamePVB,
    displayPlayerScores: displayPlayerScores,
  };
})();

gameController.playGamePVB(); // Runs playGame function for PVP testing

/*
  BOT MODULE
*/
const bot = (function () {
  let botDifficulty = "hard";

  const setBotDifficulty = (difficulty) => {
    botDifficulty = difficulty;
  };

  const getBotMove = (turn) => {
    if (botDifficulty === "easy") {
      return easyBotMove();
    } else if (botDifficulty === "hard") {
      return hardBotMove(turn);
    }
  };

  const getRandomMove = () => {
    let allPossibleMoves = gameboard.getAvailableMoves();
    return allPossibleMoves[
      [Math.floor(Math.random() * allPossibleMoves.length)]
    ];
  };

  const getWinningMove = (mark) => {
    let allPossibleMoves = gameboard.getAvailableMoves();
    for (let i = 0; i < allPossibleMoves.length; i++) {
      let possibleMove = allPossibleMoves[i];
      let row = possibleMove.charAt(0);
      let column = possibleMove.charAt(2);
      gameboard.placeMarker(row, column, mark);
      if (gameboard.checkForWin()) {
        gameboard.removeMarker(row, column);
        let winningMove = `${row}_${column}`;
        console.log(`${row}${column}`); // for testing
        return winningMove;
      }
      gameboard.removeMarker(row, column);
    }
    return false;
  };

  const easyBotMove = () => {
    // Will be in format "1_1"
    return getRandomMove();
  };

  const hardBotMove = (turn) => {
    // Returns format "1_1"
    let botWinningMove = getWinningMove("O");
    let opponentWinningMove = getWinningMove("X");
    if (turn === 1) {
      return "1_1";
    } else if (turn === 2) {
      if (gameboard.isCellEmpty(2, 2)) {
        return "2_2";
      } else if (gameboard.isCellEmpty(1, 1)) {
        return "1_1";
      }
    }
    if (botWinningMove != false) {
      return botWinningMove;
    } else if (opponentWinningMove != false) {
      return opponentWinningMove;
    } else {
      return getRandomMove();
    }
  };

  return {
    getBotMove: getBotMove,
    setBotDifficulty: setBotDifficulty,
  };

  // hard will always make the winning move and block your winning moves
})();

const buttonController = (function () {
  // Cache DOM
  const resetGameButton = document.querySelector(".reset-game");
  const resetScoreButton = document.querySelector(".reset-score");

  // Add listeners
  resetGameButton.addEventListener("click", (e) => {
    gameController.removeGameoverMessage();
    gameboard.clearGameBoard();
    gameboard.displayGameboard(); // for Testing
    gameController.clearDisplayGameBoard();
    gameController.toggleStartingPlayer();
    gameController.playGamePVB();
  });

  resetScoreButton.addEventListener("click", (e) => {
    players.resetScores();
    gameController.displayPlayerScores();
  });
})();
/*
TODO:
1. Add variable for e.target in playGame function to increase readability
2. Remove next round button while in game.
3. Style gameboard      
 */
