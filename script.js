'use strict';

const allPositions = Array.from(document.querySelectorAll('.position'));
const elPlayer1Score = document.querySelector('.player--0-score');
const elPlayer2Score = document.querySelector('.player--1-score');
const containerApp = document.querySelector('.app');
const elPlayer1 = document.querySelector('.player--0');
const elPlayer2 = document.querySelector('.player--1');
const playerScores = [0, 0];
let currentPlayer = 0;
let marker;
const clickedPos = Array.from({ length: 9 }, () => 0);
const winningPos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const reset = () => {
  clickedPos.fill(0);
  allPositions.forEach(pos => (pos.textContent = ''));
  allPositions.forEach(pos => (pos.style.color = '#fff'));
  containerApp.classList.remove('unclickable');
  nextPlayer();
};

const updateScores = () => {
  elPlayer1Score.textContent = playerScores[0];
  elPlayer2Score.textContent = playerScores[1];
};

const nextPlayer = () => {
  currentPlayer = currentPlayer === 0 ? 1 : 0;
  marker = currentPlayer === 0 ? 'X' : 'O';
  elPlayer1.classList.remove('active--player');
  elPlayer2.classList.remove('active--player');

  document
    .querySelector(`.player--${currentPlayer}`)
    .classList.add('active--player');
};
const checkWinner = () => {
  let filled = [];
  let winner;
  for (let i = 0; i < winningPos.length; i++) {
    for (let j = 0; j < winningPos[i].length; j++) {
      filled.push(
        clickedPos.at(winningPos[i][j]),
        clickedPos.at(winningPos[i][j + 1]),
        clickedPos.at(winningPos[i][j + 2])
      );

      if (
        filled.every(mark => mark === 'X') ||
        filled.every(mark => mark === 'O')
      ) {
        winner = [
          allPositions.at(winningPos[i][j]),
          allPositions.at(winningPos[i][j + 1]),
          allPositions.at(winningPos[i][j + 2]),
        ];
        console.log('winner');
      } else {
        filled = [];
      }
      break;
    }
  }

  if (winner) {
    // stop the game
    containerApp.classList.add('unclickable');
    // gray out loosing mark a
    allPositions.forEach(pos => (pos.style.color = '#777'));
    winner.forEach(pos => (pos.style.color = '#fff'));
    // update the scores
    if (winner[0].textContent === 'X') playerScores[0]++;
    else if (winner[0].textContent === 'O') playerScores[1]++;
    updateScores();
    // reset after a 5s
    nextPlayer();
    setTimeout(reset, 5000);
  }
  if (clickedPos.some(pos => pos === 0)) {
    // if there are still open spots
    document
      .querySelector(`.player--${currentPlayer}`)
      .classList.remove('active--player');
    currentPlayer = currentPlayer === 0 ? 1 : 0;
    document
      .querySelector(`.player--${currentPlayer}`)
      .classList.add('active--player');
  } else if (clickedPos.every(pos => pos !== 0)) {
    // if there is a tie
    containerApp.classList.add('unclickable');
    setTimeout(reset, 5000);
    currentPlayer = currentPlayer === 0 ? 1 : 0;
  }
};

// Start game
updateScores();
allPositions.forEach(pos => {
  document
    .querySelector(`.player--${currentPlayer}`)
    .classList.add('active--player');
  pos.textContent = '';
  pos.addEventListener('click', function () {
    // restrict double clicking the same box to change pos
    if (clickedPos[Number(pos.id)] !== 0) return;
    marker = currentPlayer === 0 ? 'X' : 'O';
    // mark the UI
    pos.textContent = marker;
    clickedPos[Number(pos.id)] = marker;

    checkWinner();
  });
});
