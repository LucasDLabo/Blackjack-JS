const gameBoard = document.getElementById('gameBoard');

const btnStart = document.getElementById('btnStart');

const handButtons = document.getElementById('handButtons');
const chipButtons = document.querySelectorAll('.chip');

const btnHit = document.getElementById('btnHit');
const btnStand = document.getElementById('btnStand');
const btnReset = document.getElementById('btnReset');

const playerScore = document.getElementById('playerScore');
const dealerScore = document.getElementById('dealerScore');

const betArea = document.getElementById('betArea');

let playerHand = [];
let dealerHand = [];

let deck = [];
const suits = ['♠','♣','♦','♥'];
const values = ['A','K','Q','J','10','9','8','7','6','5','4','3','2'];

let balance = 1000;
let currentBet = 0;
const totalBet = document.getElementById('totalBet');

const balanceDisplay = document.getElementById('balance');
const betInput = document.getElementById('betInput');
const placeBetBtn = document.getElementById('placeBet');


btnStart.addEventListener('click', startGame);
btnReset.addEventListener('click', startGame);
btnHit.addEventListener('click', hit);
btnStand.addEventListener('click', stand);

const btnClear = document.getElementById('btnClear');
btnClear.addEventListener('click', clearBet);

function startGame() {
    console.clear();
    enableActions();
    
    btnStart.style.display = 'none';
    dealerScore.classList.add('invisible');
    betArea.classList.remove('invisible');
    updateBalance();
}

const btnBet = document.getElementById('btnBet');

btnBet.addEventListener('click', startHand);
function startHand(){
    const chipSection = document.getElementById('chips');
    chipSection.classList.add('invisible');
    btnBet.classList.add('invisible');
    btnClear.classList.add('invisible');

    const bet = parseInt(totalBet.textContent);
    currentBet = bet;
    updateBalance();
    dealerHand = [];
    createDeck();
    shuffleDeck();
    playerHand = [giveCard(), giveCard()];
    dealerHand = [giveCard()];
    handButtons.classList.remove('invisible');
    updateScreen(); 
}

function hit() {
    playerHand.push(giveCard());
    updateScreen();

    if (calculateHandValue(playerHand) > 21) {
        console.warn("Went over 21. You Lose");
        disableActions();
    }
}

function stand() {
    // Dealer plays...
    while (calculateHandValue(dealerHand) < 17) {
        dealerHand.push(giveCard());
    }
    dealerScore.classList.remove('invisible');
    updateScreen();
    whoWin();
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

        // Top-left
        const topLeft = document.createElement('div');
        topLeft.classList.add('top-left');
        topLeft.innerHTML = `${card.value}<br>${card.suit}`;

        // Center
        const center = document.createElement('div');
        center.classList.add('center');
        center.textContent = card.suit;

        // Bottom-right
        const bottomRight = document.createElement('div');
        bottomRight.classList.add('bottom-right');
        bottomRight.innerHTML = `${card.value}<br>${card.suit}`;

        cardDiv.appendChild(topLeft);
        cardDiv.appendChild(center);
        cardDiv.appendChild(bottomRight);

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
    renderHand(dealerHand, 'dealerShow');

    playerScore.innerHTML = `Hand value: ${calculateHandValue(playerHand)}`;
    dealerScore.innerHTML = `Hand value: ${calculateHandValue(dealerHand)}`;

    console.group("Points");
    console.log(`Jugador: ${calculateHandValue(playerHand)}`);
    console.log(`Dealer: ${calculateHandValue(dealerHand)}`);
    console.groupEnd();
}

function whoWin() {
    const playerTotal = calculateHandValue(playerHand);
    const dealerTotal = calculateHandValue(dealerHand);

    if (dealerTotal > 21) {
        console.log("El dealer se pasó. ¡Ganas!");
        balance += currentBet * 2;
        updateBalance();
    } else if (playerTotal > dealerTotal) {
        console.log("¡Le ganas al Dealer!");
        balance += currentBet * 2;
        updateBalance();
    } else if (playerTotal < dealerTotal) {
        console.warn("¡Pierdes!");
    } else {
        console.info("Push!");
        balance += currentBet;
        updateBalance();
    }
    disableActions();
}

function disableActions() {
    btnHit.disabled = true;
    btnStand.disabled = true;
    btnHit.classList.add('opacity-20');
    btnStand.classList.add('opacity-20');
}
function enableActions() {
    btnHit.disabled = false;
    btnStand.disabled = false;
    btnHit.classList.remove('opacity-20');
    btnStand.classList.remove('opacity-20');
}

// placeBetBtn.addEventListener('click', () => {
//     const bet = parseInt(betInput.value);

//     if (isNaN(bet) || bet <= 0) {
//         alert("Apuesta inválida");
//         return;
//     }

//     if (bet > balance) {
//         alert("No tienes suficiente saldo");
//         return;
//     }

//     currentBet = bet;
//     balance -= bet;
//     updateBalance();
//     startHand();
// });

chipButtons.forEach(chip => {
    chip.addEventListener('click', () => {
        const value = parseInt(chip.dataset.value);
        if (balance >= value) {
        currentBet += value;
        balance -= value;

        updateBalance();
        } else {
        alert("No tienes suficiente saldo");
        }
    });
    });

function updateBalance() {
    balanceDisplay.textContent = balance;
    totalBet.textContent = currentBet;
}

function clearBet() {
    currentBet = 0;
    balance = 1000;
    updateBalance();
}