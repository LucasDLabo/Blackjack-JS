const gameBoard = document.getElementById('gameBoard');

const controls = document.getElementById('controls');
const handButtons = document.getElementById('handButtons');

const btnHit = document.getElementById('btnHit');
const btnStand = document.getElementById('btnStand');
const btnDouble = document.getElementById('btnDouble');
const btnInsurance = document.getElementById('btnInsurance');

const playerScore = document.getElementById('playerScore');
const dealerScore = document.getElementById('dealerScore');

const betArea = document.getElementById('betArea');
const btnResetMoney = document.getElementById('btnResetMoney');

let playerHand = [];
let dealerHand = [];

let deck = [];
const suits = ['♠','♣','♦','♥'];
const values = ['A','K','Q','J','10','9','8','7','6','5','4','3','2'];

let balance = 0;
let currentBet = 0;
const totalBet = document.getElementById('totalBet');

const balanceDisplay = document.getElementById('balance');
const betInput = document.getElementById('betInput');
const placeBetBtn = document.getElementById('placeBet');

const savedBalance = localStorage.getItem('balance');

if (savedBalance !== null) {
    balance = parseInt(savedBalance);
} else {
    balance = 1000;
}

const btnStart = document.getElementById('btnStart');
btnStart.addEventListener('click', startGame);

function startGame() {
    console.clear();
    renderHand([], 'playerShow');
    renderHand([], 'dealerShow');
    currentBet = 0;
    h2text.textContent = "Place your bet";
    enableActions();
    
    btnStart.style.display = 'none';
    dealerScore.classList.add('invisible');
    playerScore.classList.add('invisible');
    btnNextHand.classList.add('hidden');
    handButtons.classList.add('hidden');

    betArea.classList.remove('invisible');
    chipSection.classList.remove('hidden');
    btnBet.classList.remove('invisible');
    btnClear.classList.remove('invisible');
    if (balance <= 0) {
        btnResetMoney.classList.remove('hidden');
    }
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
        } 
    });
});

function updateBalance() {
    Math.floor(currentBet);
    console.log(Math.floor(currentBet));
    balanceString = balance
    currentBetString = currentBet
    balanceDisplay.textContent = balanceString.toLocaleString();
    totalBet.textContent = currentBetString.toLocaleString();

    localStorage.setItem('balance', balance);
}
btnResetMoney.addEventListener('click', resetMoney);
function resetMoney() {
    balance = 1000;
    updateBalance();
    btnResetMoney.classList.add('hidden');
}

const btnClear = document.getElementById('btnClear');
btnClear.addEventListener('click', clearBet);
function clearBet() {
    balance += currentBet;
    currentBet = 0;
    updateBalance();
}

const h2text = document.getElementById('h2text');
const btnBet = document.getElementById('btnBet');
const chipSection = document.getElementById('chips');
btnBet.addEventListener('click', startHand);
function startHand(){

    btnDouble.disabled = false;

    if (currentBet == 0) {
        // alert("Introduzca una apuesta");
        return;
    }
    
    if (balance < currentBet) {
        btnDouble.disabled = true;
    }

    h2text.textContent = "Choose your action";

    btnInsurance.disabled = true;
    
    chipSection.classList.add('hidden');
    btnBet.classList.add('invisible');
    btnClear.classList.add('invisible');
    
    handButtons.classList.remove('hidden');
    playerScore.classList.remove('invisible');
    dealerScore.classList.remove('invisible');
    btnHit.classList.remove('invisible');
    btnStand.classList.remove('invisible');

    handButtons.classList.add('flex');

    updateBalance();
    dealerHand = [];
    createDeck();
    shuffleDeck();
    playerHand = [giveCard(), giveCard()];
    dealerHand = [giveCard()];
    
    updateScreen(); 

    if (dealerHand[0].value === 'A' && balance >= currentBet / 2) {
        btnInsurance.disabled = false;
    }

    if (calculateHandValue(playerHand) === 21 && playerHand.length === 2) {
        handButtons.classList.add('hidden');
        setTimeout(() => {
            stand();
        }, 1000);
        
    }
}

btnHit.addEventListener('click', hit);

function hit() {
    btnDouble.disabled = true;
    playerHand.push(giveCard());
    updatePlayerHand();

    if (calculateHandValue(playerHand) > 21) {
        setTimeout( () => {
            showResult('lose', currentBet, "You went over 21!");
        }, 1000);
        disableActions();
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

btnDouble.addEventListener('click', double);
function double() {
    if (balance < currentBet) {
        return;
    }

    // Double Bet
    balance -= currentBet;
    currentBet *= 2;
    updateBalance();

    playerHand.push(giveCard());
    updatePlayerHand();

    btnHit.disabled = true;
    btnStand.disabled = true;
    btnDouble.disabled = true;

    // Automatically stand
    if (calculateHandValue(playerHand) > 21) {
        setTimeout( () => {
            showResult('lose', currentBet, "You went over 21!");
        }, 1000);
        disableActions();
    } else {
        setTimeout(() => {
            stand();
        }, 1000);
    }
}

let insuranceBet = 0;
btnInsurance.addEventListener('click', insurance);
function insurance() {
    const maxInsurance = currentBet / 2;

    if (balance < maxInsurance) {
        btnInsurance.disabled = true;
        return;
    }

    insuranceBet = maxInsurance;
    balance -= maxInsurance;
    updateBalance();

    btnInsurance.disabled = true;
    dealerHand.push(giveCard());

    if (calculateHandValue(dealerHand) == 21) {
        balance += insuranceBet * 3;
        updateScreen();
        
        setTimeout(() => {
            showResult('insurance', insuranceBet * 3, "Dealer has Blackjack.");
            updateBalance();
            disableActions();
        }, 1000);
        
    } else {
        insuranceBet = 0;
        setTimeout(() => {
            showResult('lose', maxInsurance, "Dealer doesn't have Blackjack.");
        }, 500);

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

function updatePlayerHand(prams) {
    renderHand(playerHand, 'playerShow');

    playerScore.innerHTML = `Hand value: ${calculateHandValue(playerHand)}`;
}

function whoWin() {
    const playerTotal = calculateHandValue(playerHand);
    const dealerTotal = calculateHandValue(dealerHand);

    if (playerTotal == 21 && playerHand.length == 2  && !(dealerTotal === 21 && dealerHand.length === 2)) {
        balance += Math.floor(currentBet * 2.5);
        updateBalance();
        showResult('win', Math.floor(currentBet * 2.5), "Blackjack!");
        disableActions();
        return;
    }
    if (dealerTotal == 21 && dealerHand.length == 2 && !(playerTotal === 21 && playerHand.length === 2)){
        setTimeout(() => {
            showResult('lose', currentBet, "Dealer has Blackjack!");
        }, 1000);
        disableActions();
        return;
    }

    if (dealerTotal > 21) {
        console.log("El dealer se pasó. ¡Ganas!");
        balance += currentBet * 2;
        updateBalance();
        setTimeout( () => {
            showResult('win', currentBet * 2, "Dealer busts!");
        }, 1000);
    } else if (playerTotal > dealerTotal) {
        console.log("¡Le ganas al Dealer!");
        balance += currentBet * 2;
        updateBalance();
        setTimeout( () => {
            showResult('win', currentBet * 2, "You beat the Dealer!");
        }, 1000);
    } else if (playerTotal < dealerTotal) {
        console.warn("¡Pierdes!");
        setTimeout( () => {
            showResult('lose', currentBet, "Dealer wins this hand!");
        }, 1000);
    } else {
        console.info("Push!");
        balance += currentBet;
        updateBalance();
        setTimeout( () => {
            showResult('tie', 0, "Push!");
        }, 1000);
        
    }
    disableActions();
}

const resultModal = document.getElementById('resultModal');
const resultTitle = document.getElementById('resultTitle');
const resultMessage = document.getElementById('resultMessage');
const resultAmount = document.getElementById('resultAmount');
const closeResult = document.getElementById('closeResult');

function showResult(result, amount, comment) {
    resultModal.classList.remove('invisible');

    resultTitle.className = '';
    resultAmount.className = '';

    if (result === 'win') {
        resultTitle.textContent = 'You Win!';
        resultTitle.className = 'text-2xl 2xl:text-3xl font-bold mb-4 text-green-700';
        resultMessage.textContent = comment;
        resultAmount.textContent = `+$${amount.toLocaleString()}`;
        resultAmount.className = 'text-xl 2xl:text-2xl font-bold text-green-700';
    } else if (result === 'lose') {
        resultTitle.textContent = 'You Lost!';
        resultTitle.className = 'text-2xl 2xl:text-3xl font-bold mb-4 text-red-700';
        resultMessage.textContent = comment;
        resultAmount.textContent = `-$${amount.toLocaleString()}`;
        resultAmount.className = 'text-xl 2xl:text-2xl font-bold text-red-700';
    } else if (result === 'insurance'){
        resultTitle.textContent = 'Insurance Paid!';
        resultTitle.className = 'text-2xl 2xl:text-3xl font-bold mb-4 text-blue-700';
        resultMessage.textContent = comment;
        resultAmount.textContent = `+$${amount.toLocaleString()}`;
        resultAmount.className = 'text-xl 2xl:text-2xl font-bold text-blue-700';
    }
    else {
        resultTitle.textContent = 'It\'s a Tie!';
        resultTitle.className = 'text-2xl 2xl:text-3xl font-bold mb-4 text-gray-700';
        resultMessage.textContent = comment;
        resultAmount.textContent = `$0`;
        resultAmount.className = 'text-xl 2xl:text-2xl font-bold text-gray-500';
    }
}

closeResult.addEventListener('click', () => {
    resultModal.classList.add('invisible');
});


const btnNextHand = document.getElementById('btnNextHand');
function disableActions() {
    btnHit.disabled = true;
    btnStand.disabled = true;
    btnDouble.disabled = true;
    btnInsurance.disabled = true;
    
    setTimeout(() => {
        h2text.textContent = "";
        handButtons.classList.add('hidden');
        controls.classList.remove('justify-between');
        controls.classList.add('justify-center');
        btnNextHand.classList.remove('hidden');
        btnNextHand.classList.add('flex');
    }, 1000);
    
}

btnNextHand.addEventListener('click', startGame);
function enableActions() {
    btnHit.disabled = false;
    btnStand.disabled = false;
    btnHit.classList.remove('opacity-20');
    btnStand.classList.remove('opacity-20');
    handButtons.classList.remove('hidden');
}