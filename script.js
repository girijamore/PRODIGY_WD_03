const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
let currentPlayer = 'X';
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let vsAI = true; // Toggle this to false for 2-player mode

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8], // Rows
  [0,3,6], [1,4,7], [2,5,8], // Columns
  [0,4,8], [2,4,6]           // Diagonals
];

function handleClick(e) {
  const index = e.target.dataset.index;
  if (gameBoard[index] !== "" || !gameActive) return;

  makeMove(index, currentPlayer);

  if (checkWinner()) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    return;
  }

  if (isDraw()) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  if (vsAI && currentPlayer === 'O' && gameActive) {
    setTimeout(aiMove, 500); // Small delay for realism
  }
}

function makeMove(index, player) {
  gameBoard[index] = player;
  cells[index].textContent = player;
}

function aiMove() {
  let index = getBestMove();
  makeMove(index, currentPlayer);

  if (checkWinner()) {
    statusText.textContent = `AI (${currentPlayer}) wins!`;
    gameActive = false;
    return;
  }

  if (isDraw()) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function getBestMove() {
  // 1. Win if possible
  for (let i = 0; i < 9; i++) {
    if (gameBoard[i] === "") {
      gameBoard[i] = currentPlayer;
      if (checkWinner()) {
        gameBoard[i] = "";
        return i;
      }
      gameBoard[i] = "";
    }
  }

  // 2. Block player win
  const opponent = 'X';
  for (let i = 0; i < 9; i++) {
    if (gameBoard[i] === "") {
      gameBoard[i] = opponent;
      if (checkWinner()) {
        gameBoard[i] = "";
        return i;
      }
      gameBoard[i] = "";
    }
  }

  // 3. Pick center, corners, then sides
  const priorities = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  for (let i of priorities) {
    if (gameBoard[i] === "") return i;
  }

  return -1; // Should not happen
}

function checkWinner() {
  return winConditions.some(combination => {
    return combination.every(i => gameBoard[i] === currentPlayer);
  });
}

function isDraw() {
  return gameBoard.every(cell => cell !== "");
}

function restartGame() {
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(cell => cell.textContent = "");
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restartGame);

// Initialize
statusText.textContent = "Player X's turn";
