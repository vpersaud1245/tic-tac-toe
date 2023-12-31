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
    { playerName: "Player 1", playerScore: 0, marker: "X" },
    { playerName: "Player 2", playerScore: 0, marker: "O" },
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
  let turnCount = 1;
  let gameTypeInProgress;
  // Cache DOM
  const gameboardCells = document.querySelectorAll(".gameboard > div");
  const gameboardElement = document.querySelector(".gameboard");
  const gameoverMessage = document.querySelector(".gameover-overlay");
  const player1Card = document.querySelector("#player1_card");
  const player2Card = document.querySelector("#player2_card");
  const player1Score = document.querySelector("#player1_score");
  const player2Score = document.querySelector("#player2_score");
  const player1ScoreDisplayLarge = document.querySelector(
    ".player1-score--large"
  );
  const player2ScoreDisplayLarge = document.querySelector(
    ".player2-score--large"
  );
  const nextGameButton = document.querySelector(".reset-game");
  const resetScoreButon = document.querySelector(".reset-score");

  const switchPlayerTurn = () => {
    if (playerTurn === "X") {
      playerTurn = "O";
    } else {
      playerTurn = "X";
    }
  };

  const getStartingPlayer = () => {
    return startingPlayer;
  };

  const resetTurnCount = () => {
    turnCount = 1;
  };

  const getPlayerTurn = () => {
    return playerTurn;
  };

  const toggleStartingPlayer = () => {
    startingPlayer = startingPlayer === "X" ? "O" : "X";
    playerTurn = startingPlayer; // Set the current player turn to the starting player
  };

  const displayGameoverMessage = () => {
    // cache DOM
    let markers = document.querySelectorAll(".gameboard_marker");
    // Add styles
    markers.forEach((marker) => {
      marker.style.opacity = "5%";
    });
    gameboardElement.style.pointerEvents = "none";
    gameoverMessage.style.display = "grid";
    nextGameButton.style.display = "block";
    resetScoreButon.style.display = "block";
    gameboardCells.forEach((cell) => {
      cell.style.backgroundColor = "#303030";
    });
  };

  const removeGameoverMessage = () => {
    // cache DOM
    let markers = document.querySelectorAll(".gameboard_marker");
    // Add styles
    markers.forEach((marker) => {
      marker.style.opacity = "100%";
    });
    gameboardElement.style.pointerEvents = "auto";
    gameoverMessage.style.display = "none";
    nextGameButton.style.display = "none";
    resetScoreButon.style.display = "none";
    gameboardCells.forEach((cell) => {
      cell.style.backgroundColor = "white";
    });
  };

  const clearDisplayGameBoard = () => {
    gameboardCells.forEach((cell) => {
      cell.textContent = "";
    });
  };

  const displayPlayerScores = () => {
    if (window.innerWidth > 1000) {
      player1ScoreDisplayLarge.textContent = `Wins: ${players.getPlayerScore(
        "X"
      )}`;
      player2ScoreDisplayLarge.textContent = `Wins: ${players.getPlayerScore(
        "O"
      )}`;
      return;
    }
    player1Score.textContent = `${players.getPlayerScore("X")}`;
    player2Score.textContent = `${players.getPlayerScore("O")}`;
  };

  const playPlayerMove = (e) => {
    const marker = document.createElement("div");
    marker.className = `${playerTurn}_marker`;
    marker.classList.add("gameboard_marker");
    marker.textContent = playerTurn;
    e.target.appendChild(marker);
    let row = e.target.className.charAt(0);
    let column = e.target.className.charAt(2);
    gameboard.placeMarker(row, column, playerTurn);
  };

  const playBotMove = (turn) => {
    let botMove = bot.getBotMove(turn);
    let row = botMove.charAt(0);
    let column = botMove.charAt(2);
    gameboard.placeMarker(row, column, playerTurn);
    const marker = document.createElement("div");
    marker.className = `${playerTurn}_marker`;
    marker.classList.add("gameboard_marker");
    marker.textContent = playerTurn;
    gameboardCells.forEach((cell) => {
      if (cell.className === botMove) {
        cell.appendChild(marker);
      }
    });
  };

  const playerCardBounceListener = () => {
    if (playerTurn === "X") {
      player2Card.style.animation = "none";
      player1Card.style.animation = "bounce--high 1600ms infinite ease-in-out";
    } else if (playerTurn === "O") {
      player1Card.style.animation = "none";
      player2Card.style.animation = "bounce--high 1600ms infinite ease-in-out";
    }
  };

  const removePVPClickHandler = () => {
    gameboardCells.forEach((cell) => {
      cell.removeEventListener("click", PVP_clicked);
    });
  };

  const PVP_clicked = (e) => {
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
        removePVPClickHandler(); // Remove the click handler after the game is over
        return;
      }
      // Check for tie
      else if (turnCount === 10) {
        displayGameoverMessage();
        gameoverMessage.textContent = "It's a tie";
        turnCount = 1;
        removePVPClickHandler(); // Remove the click handler after the game is over
        return;
      }
      switchPlayerTurn();
      playerCardBounceListener();
    }
  };

  const playGamePVP = () => {
    gameTypeInProgress = "PVP";
    gameboardCells.forEach((cell) => {
      cell.addEventListener("click", PVP_clicked);
    });
  };

  const PVB_clicked = (e) => {
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
        removePVBClickHandler();
        return;
      }
      switchPlayerTurn();
      // Displays tie if player goes first
      if (turnCount === 10) {
        displayGameoverMessage();
        gameoverMessage.textContent = "Its a tie";
        turnCount = 1;
        removePVBClickHandler();
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
          removePVBClickHandler();
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
          removePVBClickHandler();
          playerCardBounceListener();
          return;
        }
        switchPlayerTurn();
        playerCardBounceListener();
      }, 300);
    }
  };

  const playGamePVB = () => {
    gameTypeInProgress = "PVB";
    // Makes bot move if bot goes first
    if (startingPlayer === "O" && turnCount === 1) {
      playBotMove(1);
      switchPlayerTurn();
    }

    gameboardCells.forEach((cell) => {
      cell.addEventListener("click", PVB_clicked);
    });
  };

  const removePVBClickHandler = () => {
    gameboardCells.forEach((cell) => {
      cell.removeEventListener("click", PVB_clicked);
    });
  };

  const getGameTypeInProgress = () => {
    return gameTypeInProgress;
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
    getGameTypeInProgress: getGameTypeInProgress,
    removePVBClickHandler: removePVBClickHandler,
    removePVPClickHandler: removePVPClickHandler,
    resetTurnCount: resetTurnCount,
    getStartingPlayer: getStartingPlayer,
    playerCardBounceListener: playerCardBounceListener,
  };
})();

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
})();

/*
  MENU BUTTON MODULE
*/
const buttonController = (function () {
  // Cache DOM
  const nextGameButton = document.querySelector(".reset-game");
  const resetScoreButton = document.querySelector(".reset-score");
  const gameselectors = document.querySelectorAll(".gameselector");
  const pvpSetup = document.querySelector(".pvp_setup");
  const pvpGameboard = document.querySelector(".gameboardPVP");
  const pvbSetup = document.querySelector(".pvb_setup");
  const mainMenu = document.querySelector(".main_menu");
  const botDifficultyBtns = document.querySelectorAll(".bot-difficulty-btn");
  // Listener functions
  const resetGame = () => {
    // Reset gameboard
    gameController.removeGameoverMessage();
    gameboard.clearGameBoard();
    gameboard.displayGameboard();
    gameController.clearDisplayGameBoard();

    // Reset Player scores
    players.resetScores();
    gameController.displayPlayerScores();

    //Reset Player Names
    let player1Name = players.getWinningPlayerName("X");
    let player2Name = players.getWinningPlayerName("O");
    players.setPlayerName(player1Name, "Player 1");
    players.setPlayerName(player2Name, "Player 2");

    gameController.resetTurnCount();
    if (gameController.getStartingPlayer() === "O") {
      gameController.toggleStartingPlayer();
    }

    gameController.removePVBClickHandler();
    gameController.removePVPClickHandler();
    if (gameController.getPlayerTurn() === "O") {
      gameController.switchPlayerTurn();
    }

    botDifficultyBtns.forEach((btn) => {
      if (btn.classList[1] == "bot-difficulty-btn--easy") {
        btn.style.backgroundColor = "#4fff0f90";
      }
      if (btn.classList[1] == "bot-difficulty-btn--hard") {
        btn.style.backgroundColor = "brown";
      }
    });
  };

  const addBackButtonListener = (button) => {
    button.addEventListener("click", (e) => {
      // Display Main Menu
      pvpGameboard.style.display = "none";
      pvpSetup.style.display = "none";
      pvbSetup.style.display = "none";
      mainMenu.style.display = "flex";
      resetGame();
    });
  };

  const addPVBSubmitButtonListener = () => {
    let submitButton = document.querySelector(".pvb_setup_submit");

    submitButton.addEventListener("click", (e) => {
      pvbSetup.style.display = "none";
      pvpGameboard.style.display = "flex";
      gameboard.clearGameBoard();
      gameController.clearDisplayGameBoard();

      // Display player Names
      let player1NameDisplay = document.querySelector("#player1_name");
      let player2NameDisplay = document.querySelector("#player2_name");
      player1NameDisplay.textContent = players.getWinningPlayerName("X");
      player2NameDisplay.textContent = players.getWinningPlayerName("O");

      gameController.displayPlayerScores();

      let inGameBackButton = document.querySelector(".inGameBackButton");
      addBackButtonListener(inGameBackButton);

      gameController.playerCardBounceListener();
      gameController.playGamePVB();
    });
  };

  const addPVPSubmitButtonListener = () => {
    gameboard.clearGameBoard();
    gameController.clearDisplayGameBoard();
    let submitButton = document.querySelector(".pvp_setup_submit");
    let player1Name = document.querySelector("input[name='player1name']");
    let player2Name = document.querySelector("input[name='player2name']");

    submitButton.addEventListener("click", (e) => {
      // Set player Names
      if (player1Name.value != "") {
        players.setPlayerName("Player 1", player1Name.value);
        player1Name.value = "";
      }
      if (player2Name.value != "") {
        players.setPlayerName("Player 2", player2Name.value);
        player2Name.value = "";
      }

      // Display gameboard
      pvpSetup.style.display = "none";
      pvpGameboard.style.display = "flex";

      // Add back button function
      let inGameBackButton = document.querySelector(".inGameBackButton");
      addBackButtonListener(inGameBackButton);

      // Display player Names
      let player1NameDisplay = document.querySelector("#player1_name");
      let player2NameDisplay = document.querySelector("#player2_name");
      player1NameDisplay.textContent = players.getWinningPlayerName("X");
      player2NameDisplay.textContent = players.getWinningPlayerName("O");

      gameController.displayPlayerScores();

      gameController.playerCardBounceListener();
      gameController.playGamePVP(); // Start Game
    });
  };

  // Add listeners
  nextGameButton.addEventListener("click", (e) => {
    gameController.removeGameoverMessage();
    gameboard.clearGameBoard();
    gameboard.displayGameboard(); // for Testing
    gameController.clearDisplayGameBoard();
    gameController.toggleStartingPlayer();
    gameController.playerCardBounceListener();
    if (gameController.getGameTypeInProgress() === "PVP") {
      gameController.playGamePVP();
    } else if (gameController.getGameTypeInProgress() === "PVB") {
      gameController.playGamePVB();
    }
  });

  const addDifficultyBtnListeners = () => {
    botDifficultyBtns.forEach((botDifficultyBtn) => {
      botDifficultyBtn.addEventListener("click", (e) => {
        let btn = e.target;

        if (btn.classList[1] == "bot-difficulty-btn--easy") {
          let hardbtn = document.querySelector(".bot-difficulty-btn--hard");
          btn.style.backgroundColor = "#4fff0f";
          hardbtn.style.backgroundColor = "gray";
          bot.setBotDifficulty("easy");
        }
        if (btn.classList[1] == "bot-difficulty-btn--hard") {
          let easybtn = document.querySelector(".bot-difficulty-btn--easy");
          bot.setBotDifficulty("hard");
          btn.style.backgroundColor = "red";
          easybtn.style.backgroundColor = "gray";
        }
      });
    });
  };

  resetScoreButton.addEventListener("click", (e) => {
    players.resetScores();
    gameController.displayPlayerScores();
  });

  // Main menu buttons
  gameselectors.forEach((selector) => {
    selector.addEventListener("click", (e) => {
      mainMenu.style.display = "none";
      if (e.target.classList[1] == "PVP_button") {
        // Display PVP setup cards and add event listeners
        resetGame();
        pvpSetup.style.display = "block";
        let setupBackButton = document.querySelector(".back");
        addBackButtonListener(setupBackButton);
        // Add setup submit button listener
        addPVPSubmitButtonListener();
      } else if (e.target.classList[1] == "PVB_button") {
        resetGame();
        pvbSetup.style.display = "block";
        let pvbSetupBackButton = document.querySelector(".pvb_setup > .back");
        addBackButtonListener(pvbSetupBackButton);
        addPVBSubmitButtonListener();
        addDifficultyBtnListeners();
      }
    });
  });
})();

/*
  MEDIA QUERY
*/

const mediaQueryController = (function () {
  // cache DOM
  window.onresize = (e) => {
    gameController.displayPlayerScores();
  };
})();

/*
TODO:
1. add easy hard button functionality
2. Make bot face on pvb board

 */
