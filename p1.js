let currentPlayer = 'X';
let board = Array(9).fill(null);
let xScore = 0;
let oScore = 0;

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1.3;
  utterance.pitch = 1.3;
  speechSynthesis.speak(utterance);
}

const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function checkWinner() {
  return winPatterns.some(pattern => {
    const [a, b, c] = pattern;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

const buttons = document.querySelectorAll('.input');
buttons.forEach((button, index) => {
  button.addEventListener('click', () => {
    if (button.textContent === '' && !checkWinner()) {
      makeMove(index);
      if (isVsComputer && currentPlayer === 'O' && !checkWinner() && board.includes(null)) {
        setTimeout(computerStrategicMove, 600);
        
        
        
      }
    }
  });
});



const statusText = document.getElementById('status');
function makeMove(index) {
  if (!board[index]) {
    buttons[index].textContent = currentPlayer;
    if (darkMode) {
      buttons[index].style.color = currentPlayer === 'X' ? '#ff5733' : '#1b3b6f';
    } else {
      buttons[index].style.color = currentPlayer === 'X' ? '#facc15' : '#22d3ee';
    }
    board[index] = currentPlayer;
    if (checkWinner()) {
      statusText.textContent = `${currentPlayer} wins!`;
      speak(`${currentPlayer} wins!`);
      updateScore(currentPlayer);
      disableBoard();
      setTimeout(resetGame, 2500);
      return;
    }
    if (board.every(cell => cell !== null)) {
      statusText.textContent = "It's a draw!";
      speak("It's a draw!");
      setTimeout(resetGame, 2500);
      return;
    }
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function computerMove() {
  let emptyCells = board
  .map((cell, index) => (cell === null ? index : null))
  .filter(index => index !== null);
  if (emptyCells.length === 0) return;
  
  let move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  buttons[move].click();
}


function computerStrategicMove() {
  const ai = currentPlayer;
  const human = ai === 'X' ? 'O' : 'X';
  let winMove = findWinningMove(ai);
  if (winMove !== null) return buttons[winMove].click();
  let blockMove = findWinningMove(human);
  if (blockMove !== null) return buttons[blockMove].click();
  const moveCount = board.filter(cell => cell !== null).length;
  
  if (moveCount <= 2) {
    const firstMoveIndex = board.findIndex(cell => cell === human);
    
    if (firstMoveIndex === 4) {
      const corners = [0, 2, 6, 8].filter(i => board[i] === null);

      if (corners.length > 0) return buttons[random(corners)].click();
    } else if ([0, 2, 6, 8].includes(firstMoveIndex)) {
     
      if (board[4] === null) return buttons[4].click();
    } else if ([1, 3, 5, 7].includes(firstMoveIndex)) {

      if (board[4] === null) return buttons[4].click();
      const oppositeEdges = { 1: 7, 3: 5, 5: 3, 7: 1 };
      const opposite = oppositeEdges[firstMoveIndex];
      if (board[opposite] === null) return buttons[opposite].click();
    }
  }
  
  let forkMove = findForkMove(ai);
  if (forkMove !== null) return buttons[forkMove].click();
  let blockFork = findForkMove(human);
  if (blockFork !== null) return buttons[blockFork].click();
  if (board[4] === null) return buttons[4].click();
  const oppositeCorners = [
    [0, 8],
    [2, 6],
  ];
  for (let [a, b] of oppositeCorners) {
    if (board[a] === human && board[b] === null) return buttons[b].click();
    if (board[b] === human && board[a] === null) return buttons[a].click();
  }
  const corners = [0, 2, 6, 8].filter(i => board[i] === null);
  if (corners.length > 0) return buttons[random(corners)].click();
  const sides = [1, 3, 5, 7].filter(i => board[i] === null);
  if (sides.length > 0) return buttons[random(sides)].click();
}




function findWinningMove(player) {
  for (let [a, b, c] of winPatterns) {
    const line = [board[a], board[b], board[c]];
    if (line.filter(v => v === player).length === 2 && line.includes(null)) {
      return [a, b, c][line.indexOf(null)];
    }
  }
  return null;
}

function findForkMove(player) {
  const empty = board.map((cell, i) => (cell === null ? i : null)).filter(i => i !== null);
  for (let move of empty) {
    const temp = [...board];
    temp[move] = player;
    let winningLines = 0;
    for (let [a, b, c] of winPatterns) {
      const line = [temp[a], temp[b], temp[c]];
      if (line.filter(v => v === player).length === 2 && line.includes(null)) {
        winningLines++;
      }
    }
    if (winningLines >= 2) return move;
  }
  return null;
}

function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


function disableBoard() {
  buttons.forEach(btn => btn.disabled = true);
}

const oScoreText = document.getElementById('o-score');
const xScoreText = document.getElementById('x-score');
function updateScore(winner) {
  if (winner === 'X') {
    xScore++;
    xScoreText.textContent = xScore;
  } else {
    oScore++;
    oScoreText.textContent = oScore;
  }
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  buttons.forEach(btn => {
    btn.textContent = '';
    btn.disabled = false;
    btn.style.color = 'white';
  });
}
const resetBtn = document.getElementById('reset');

resetBtn.addEventListener('click', resetGame);

const allReset = document.getElementById('allReset');
function resetALL(){
  resetGame();
  xScore = 0;
  oScore = 0;
  xScoreText.textContent = 0;
  oScoreText.textContent = 0;
}

allReset.addEventListener('click',resetALL);

const playerBtn = document.getElementById('playerBtn');
let isVsComputer = false;
playerBtn.addEventListener('click', () => {
  isVsComputer = !isVsComputer;
  if (isVsComputer) {
    playerBtn.textContent = "vs COMPUTER 🤖";
    speak("Computer mode activated");
  } else {
    playerBtn.textContent = "2 PLAYERS 🎮";
    speak("Two player mode activated");
  }
  resetGame();
  resetALL();
});

document.querySelector("#scroal").addEventListener("click", () => {
  document.querySelector(".box").scrollIntoView({
    behavior: "smooth"
  });
});



let darkMode = false;
modeBtn = document.getElementById("mode");

modeBtn.textContent = "🌙 Dark Mode";

modeBtn.addEventListener("click", () => {
  const body = document.body;
  const box = document.querySelector(".box");
  const status = document.getElementById("status");
  const scoreboard = document.querySelector(".scoreboard");

  

  if (darkMode) {
    body.style.background = "linear-gradient(135deg, #1a1033, #2c1e4a)";
    box.style.background = "linear-gradient(145deg, #e0631bff, #fca311)";
    status.style.color = "#ffffff";
    scoreboard.style.color = "#ffffff";
    modeBtn.textContent = "🌙 Dark Mode";
    modeBtn.style.background = "linear-gradient(145deg, #e0631bff, #fca311)";
    modeBtn.style.color = "#ffffff";
    playerBtn.style.background = "linear-gradient(145deg, #e0631bff, #fca311)";
    playerBtn.style.color = "#ffffff";
   buttons.forEach(btn =>{
      btn.style.background =  "linear-gradient(145deg, #1e3a8a, #2b56d1)";
    });
  

  } else {
    
    body.style.background = "linear-gradient(135deg, #2160ddff, #f4e2d8)";
    box.style.background = "linear-gradient(155deg, #4cf86eff, #2024f8ff, #4cf86eff)";
    status.style.color = "#000000";
    scoreboard.style.color = "#000000ff";
    modeBtn.textContent = "🌞 Light Mode";
    modeBtn.style.background = "linear-gradient(135deg, #3b82f6, #2563eb)";
    modeBtn.style.color = "#211832";
    playerBtn.style.background = "linear-gradient(135deg, #3b82f6, #2563eb)";
    playerBtn.style.color = "#211832";
     buttons.forEach(btn =>{
      btn.style.background =  "linear-gradient(145deg, #ffffffff, #0aca50ff)";
    });
   
    

  }

  darkMode = !darkMode;
});




