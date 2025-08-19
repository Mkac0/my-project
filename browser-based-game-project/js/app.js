const rows = 3, cols = 3
const set = 3;
const cards = rows * cols;
const totalSets = cards / set;

let deck = [];
let selection = [];
let lock = false;
let moves = 0, matches = 0;

const $board = document.getElementById('board');
const $moves = document.getElementById('moves');
const $matches = document.getElementById('matches');
const $restart = document.getElementById('restart');
const $endDialog = document.getElementById('endDialog');
const $endMessage = document.getElementById('endMessage');

$restart.addEventListener('click', initGame);

initGame();

function initGame() {
    deck = [];
    for(let v = 1; v <= totalSets; v++) {
        for(let i = 0; i < set; i++) deck.push({
            value: v, isUp: false, isMatched: false
        });
    }

    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    console.log("Deck:", deck);

    selection = [];
    lock = false;
    moves = 0;
    matches = 0
    updatedHud();

    if($endDialog.open) $endDialog.close();

    $board.innerHTML = '';
    deck.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.className = 'button';
        btn.type = 'button';
        btn.dataset.index = String(i);
        btn.ariaLabel = 'Card';
        btn.addEventListener('click', onCardClick);
        $board.appendChild(btn);
        renderCard(i);
    });
}

function onCardClick(e) {
    if (lock) return;
    const index = Number(e.currentTarget.dataset.index);
    const card = deck[index];

    console.log("Card clicked:", index, card);

    if (card.isMatched || card.isUp) return;

    card.isUp = true;
    selection.push(index);
    renderCard(index);

    console.log("Current selection:", selection.map(i => deck[i].value));

    if (selection.length < set) return;

    moves++
    updatedHud();

    if (isSet) {
        selection.forEach(i => {
            deck[i].isMatched = true;
            renderCard(i);
        });
        selection = [];
        matches++;
        updatedHud();
        if(matches === totalSets)
            endGame(true);

        console.log("Set found:", selection.map(i => deck[i].value));
    } else {
        lock = true;
        setTimeout(() => {
            selection.forEach(i => {
                deck[i].isUp = false;
                renderCard(i);
            });
            selection = [];
            lock = false;
        }, 900);

        console.log("Game eneded", won, "Moves:", moves, "Matches:", matches);
    }
}

function isSet() {
    const firstVal = deck[selection[0]].value;
    return selection.every(i => deck[i].value === firstVal);
}

function renderCard(index) {
    const card = deck[index];
    const el = $board.querySelector(`[data-index="${index}"]`);
    el.classList.remove('v1', 'v2', 'v3', 'up', 'matched');

    if (card.isMatched) {
        el.classList.add('matched', `v${card.value}`);
        el.disabled = true;
        return;
    }
    if (card.isUp) {
        el.classList.add('up', `v${card.value}`);
        el.style.transform = 'scale(1.02)';
    } else {
        el.style.transform = 'scale(1)';
    }
}

function updatedHud() {
    $moves.textContent = String(moves);
    $matches.textContent = String(matches);
}

function endGame(won) {
    $endMessage.textContent = won
    ? `You win! Sets: ${matches}, Moves: ${moves}`
    : `Game over. Sets: ${matches}, Moves: ${moves}`;
    $endDialog.showModal();
}