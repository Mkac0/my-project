const ROWS = 3, COLS = 3
const PAIRS = (ROWS * COLS) / 3;

let deck = [];
let firstIndex = null, secondIndex = null;
let lock = false;
let moves = 0, matches = 0;

const $board = document.getElementById('board');
const $moves = document.getElementById('moves');
const $matches = document.getElementById('matches');
const $restart = document.getElementById('restart');
const $endDialog = document.getElementById('endDialog');
const $endMessage = document.getElementById('endMessage');

initGame();

function initGame() {
firstIndex = secondIndex = null;
lock = false;
moves = 0;
matches = 0

$restart.onclick = $restart;
}

function restart() {
    if ($endDialog.open) $endDialog.closest();
}

function updatedHud() {
    $moves.textContent = String(moves);
    $matches.textContent = String(matches);
}

function onCardClick(e) {
    if (lock) return;
    const index = Number(e.currentTarget.dataset.index);
    const card = deck[index];
    if (card.isMatched || card.isUp) return;

    card.isUp = true;
    updateCardVier(index);

    if (firstIndex === null) {
        firstIndex = idx;
        return;
    }

    secondIndex = idx;
    lock = true;
    moves++; updatedHud;
}

function endGame(won) {
    $endMessage.textContent = won
}