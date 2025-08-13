const gameBoard = document.getElementById('gameBoard');

const handButtons = document.getElementById('handButtons');


const btnHit = document.getElementById('btnHit');
const btnStand = document.getElementById('btnStand');

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

const btnStart = document.getElementById('btnStart');
btnStart.addEventListener('click', startGame);

function startGame() {
    console.clear();
    renderHand([], 'playerShow');
    renderHand([], 'dealerShow');
    currentBet = 0;
    enableActions();
    
    btnStart.style.display = 'none';
    dealerScore.classList.add('invisible');
    playerScore.classList.add('invisible');
    btnNextHand.classList.add('invisible');

    betArea.classList.remove('invisible');
    chipSection.classList.remove('invisible');
    btnBet.classList.remove('invisible');
    btnClear.classList.remove('invisible');
    updateBalance();
}

const chipButtons = document.querySelectorAll('.chip');
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

const btnClear = document.getElementById('btnClear');
btnClear.addEventListener('click', clearBet);
function clearBet() {
    balance += currentBet;
    currentBet = 0;
    updateBalance();
}

const btnBet = document.getElementById('btnBet');
const chipSection = document.getElementById('chips');
btnBet.addEventListener('click', startHand);
function startHand(){

    if (currentBet == 0) {
        alert("Introduzca una apuesta");
        return;
    }
    
    chipSection.classList.add('invisible');
    btnBet.classList.add('invisible');
    btnClear.classList.add('invisible');
    
    handButtons.classList.remove('invisible');
    playerScore.classList.remove('invisible');
    dealerScore.classList.remove('invisible');
    btnHit.classList.remove('invisible');
    btnStand.classList.remove('invisible');

    const bet = parseInt(totalBet.textContent);
    currentBet = bet;
    updateBalance();
    dealerHand = [];
    createDeck();
    shuffleDeck();
    playerHand = [giveCard(), giveCard()];
    dealerHand = [giveCard()];
    
    updateScreen(); 
}

btnHit.addEventListener('click', hit);
function hit() {
    playerHand.push(giveCard());
    updateScreen();

    if (calculateHandValue(playerHand) > 21) {
        console.warn("Went over 21. You Lose");
        disableActions();
        showResult('lose', currentBet);
    }
}

btnStand.addEventListener('click', stand);
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

}

function whoWin() {
    const playerTotal = calculateHandValue(playerHand);
    const dealerTotal = calculateHandValue(dealerHand);

    if (dealerTotal > 21) {
        console.log("El dealer se pasó. ¡Ganas!");
        balance += currentBet * 2;
        updateBalance();
        showResult('win', currentBet * 2);   // ganó $50
        // Start Another Hand
    } else if (playerTotal > dealerTotal) {
        console.log("¡Le ganas al Dealer!");
        balance += currentBet * 2;
        updateBalance();
        showResult('win', currentBet * 2);   // ganó $50
        // Start Another Hand
    } else if (playerTotal < dealerTotal) {
        console.warn("¡Pierdes!");
        showResult('lose', currentBet);  // perdió $25
        // Start Another Hand
    } else {
        console.info("Push!");
        balance += currentBet;
        updateBalance();
        showResult('tie', 0);    // empate
        // Start Another Hand
    }
    disableActions();
}

const resultModal = document.getElementById('resultModal');
const resultTitle = document.getElementById('resultTitle');
const resultMessage = document.getElementById('resultMessage');
const resultAmount = document.getElementById('resultAmount');
const closeResult = document.getElementById('closeResult');

function showResult(result, amount) {
    resultModal.classList.remove('invisible');
    resultModal.querySelector('div').classList.add('show-modal');

    if (result === 'win') {
        resultTitle.textContent = 'You Won!';
        resultMessage.textContent = 'Congratulations!';
        resultAmount.textContent = `+$${amount}`;
        resultAmount.className = 'text-green-500 text-xl font-bold';
    } 
    else if (result === 'lose') {
        resultTitle.textContent = 'You Lost!';
        resultMessage.textContent = 'Better luck next time.';
        resultAmount.textContent = `-$${amount}`;
        resultAmount.className = 'text-red-500 text-xl font-bold';
    } 
    else {
        resultTitle.textContent = 'It\'s a Tie!';
        resultMessage.textContent = 'No one wins this round.';
        resultAmount.textContent = `$0`;
        resultAmount.className = 'text-gray-500 text-xl font-bold';
    }
}

closeResult.addEventListener('click', () => {
    resultModal.classList.add('invisible');
});


const btnNextHand = document.getElementById('btnNextHand');
function disableActions() {
    btnHit.disabled = true;
    btnStand.disabled = true;
    btnHit.classList.add('invisible');
    btnStand.classList.add('invisible');
    btnNextHand.classList.remove('invisible');
}

btnNextHand.addEventListener('click', startGame);
function enableActions() {
    btnHit.disabled = false;
    btnStand.disabled = false;
    btnHit.classList.remove('opacity-20');
    btnStand.classList.remove('opacity-20');
}