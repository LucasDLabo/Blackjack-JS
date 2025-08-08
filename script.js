const gameBoard = document.getElementById('gameBoard');

const btnStart = document.getElementById('btnStart');
const btnHit = document.getElementById('btnHit');
const btnStand = document.getElementById('btnStand');
const btnReset = document.getElementById('btnReset');

let playerHand = [];
let dealerHand = [];

let deck = [];
const suits = ['♠','♣','♦','♥'];
const values = ['A','K','Q','J','10','9','8','7','6','5','4','3','2'];


btnStart.addEventListener('click', startGame);
btnHit.addEventListener('click', hit);

function startGame() {
    createDeck();
    shuffleDeck();
    playerHand = [giveCard(), giveCard()];
    btnStart.style.display = 'none';
    gameBoard.style.display = 'flex';
    btnHit.style.display = 'inline-block';
    btnStand.style.display = 'inline-block';
    btnReset.style.display = 'inline-block';

    // dealerHand = [giveCard()];

    updateScreen();
    // resultDisplay.textContent = '';
}


// btnGenerate.addEventListener('click', generateCard);

function hit() {
    playerHand.push(giveCard());
    updateScreen();

    if (calculateHandValue(playerHand) > 21) {
        console.warn("Went over 21. You Lose");
    }
}

function generateCard() {
    if (deck.length === 0) {
        console.log("No cards left");
        return;
    }
    playerHand.push(giveCard());
    renderHand(playerHand, 'playerShow');
    
    console.log(`Hand Points: ${calculateHandValue(playerHand)}`);
}

function renderHand(hand, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';

    for (const card of hand) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');

        if (card.suit === '♦' || card.suit === '♥') {
            cardDiv.classList.add('red');
        } else {
            cardDiv.classList.add('black');
        }

        cardDiv.textContent = `${card.suit}${card.value}`;
        container.appendChild(cardDiv);
    }
}

function calculateHandValue(hand) {
    let value = 0;
    let aces = 0;

    for (const card of hand) {
        if (card.value === 'A') {
            value += 11;
            aces++;
        } else if (['K','Q','J'].includes(card.value)) {
            value += 10;
        } else {
            value += parseInt(card.value);
        }
    }

    // Adjust value if score is bigger than 21
    while (value > 21 && aces > 0) {
        value -= 10;
        aces--;
    }

    return value;
}

function createDeck() {
    deck = [];
    for (const suit of suits) {
        for (const value of values) {
            deck.push({value, suit});
        }
    }
}

// Fisher–Yates Shuffle
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i-- ){
        const n = Math.floor(Math.random() * (i + 1));
        [deck[i],deck[n]] = [deck[n], deck[i]];
    }
}

function giveCard(){
    return deck.pop();
}

function updateScreen() {
    renderHand(playerHand, 'playerShow');
    // renderHand(dealerHand, 'dealerDisplay');

    console.log(`Jugador: ${calculateHandValue(playerHand)}`);
    // dealerScore.textContent = `Dealer: ${calculateHandValue(dealerHand)}`;
}
