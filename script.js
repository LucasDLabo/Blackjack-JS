// <<< DOM Elements >>>
// First screen elements
const startSection = document.getElementById('startSection');
const controls = document.getElementById('controls');
const btnStart = document.getElementById('btnStart');

// Betting elements
const betArea = document.getElementById('betArea');
const playerScore = document.getElementById('playerScore');
const dealerScore = document.getElementById('dealerScore');
const h2text = document.getElementById('h2text');
const chipSection = document.getElementById('chips');
const btnAllin = document.getElementById('btnAllin');
const labelAllIn = document.getElementById('labelAllIn');
const btnResetMoney = document.getElementById('btnResetMoney');
const btnClear = document.getElementById('btnClear');
const labelClear = document.getElementById('labelClear');
const balanceDisplay = document.getElementById('balance');
const textBalance = document.getElementById('textBalance');
const totalBet = document.getElementById('totalBet');
const btnBet = document.getElementById('btnBet');

// Action buttons elements
const handButtons = document.getElementById('handButtons');
const btnHit = document.getElementById('btnHit');
const btnStand = document.getElementById('btnStand');
const btnDouble = document.getElementById('btnDouble');
const btnInsurance = document.getElementById('btnInsurance');
const btnNextHand = document.getElementById('btnNextHand');

// Card counting elements
const runningCount = document.getElementById('runningCount');
const totalCounter = document.getElementById('totalCounter');
const givenCounter = document.getElementById('givenCounter');
const remainingCounter = document.getElementById('remainingCounter');

// Modal elements
const resultModal = document.getElementById('resultModal');
const resultTitle = document.getElementById('resultTitle');
const resultMessage = document.getElementById('resultMessage');
const resultAmount = document.getElementById('resultAmount');
const closeResult = document.getElementById('closeResult');
// ============================================================
// <<< Game Variables >>>
// Deck and hands
let deck = [];
const suits = ['♠','♣','♦','♥'];
const values = ['A','K','Q','J','10','9','8','7','6','5','4','3','2'];
let playerHand = [];
let dealerHand = [];
let isDeckLow = false;
let isInsuranceCardGenerated = false;

// Money
let balance = 0;
let currentBet = 0;

// localStorage balance saving and loading
const savedBalance = localStorage.getItem('balance');
if (savedBalance !== null) {
    balance = parseInt(savedBalance);
} else {
    balance = 10000;
}
// ============================================================
createDeck(2);
shuffleDeck();

totalCounter.textContent = `Total Cards: ${deck.length}`;
totalCounter.setAttribute('title', `${deck.length} cards is equal to 2 Decks`);
remainingCounter.innerHTML = `Remaining: <span class="text-green-400 font-bold">${deck.length}</span>`;

btnStart.addEventListener('click', startGame);
function startGame() {
    updateChipStates();

    renderHand([], 'playerShow');
    renderHand([], 'dealerShow');
    enableActions();
    
    toggleElementVisibility([dealerScore, playerScore], true, 'invisible');
    toggleElementVisibility([startSection, btnNextHand, handButtons], true, 'hidden');
    toggleElementVisibility([betArea, chipSection, runningCount], false, 'hidden');

    toggleDisabled([btnStart, btnBet], true);
    toggleDisabled([btnClear, btnAllin], false);

    runningCount.classList.add('flex');
    labelAllIn.classList.remove('opacity-20');
    labelClear.classList.remove('opacity-20');
    textBalance.classList.remove('opacity-20');

    currentBet = 0;
    h2text.textContent = "Place your bet";
    
    // Changes All-in button to reset money if balance is 0
    if (balance <= 0) {
        btnResetMoney.classList.remove('hidden');
        labelAllIn.textContent = "Reset";
        btnAllin.classList.add('hidden');
    }
    updateBalance();
    updateTextBalance();
    
    if (isDeckLow == true) {
        createDeck(2);
        shuffleDeck();
        showResult('newDeck', 0, "New deck created and shuffled!");

        givenCards = 0;
        givenCounter.innerHTML = `Cards given: <span class="text-blue-400 font-bold">${givenCards}</span>`;

        remainingCounter.innerHTML = `Remaining: <span class="text-green-400 font-bold">${deck.length}</span>`;

        isDeckLow = false;
    }
    
}

const chipButtons = document.querySelectorAll('.chip');
chipButtons.forEach(chip => {
    chip.addEventListener('click', () => {
        const value = parseInt(chip.dataset.value);
        if (balance < value) return;

        currentBet += value;
        balance -= value;

        updateBalance();
        updateTextBalance();
        btnBet.disabled = currentBet === 0;

        updateChipStates();
    });
});

updateChipStates();

function updateChipStates() {
    chipButtons.forEach(chip => {
        const value = parseInt(chip.dataset.value);
        const isDisabled = value > balance;
        chip.classList.toggle('opacity-30', isDisabled);
        chip.disabled = isDisabled;
    });
}

function updateBalance() {
    Math.floor(currentBet);
    balanceString = balance
    currentBetString = currentBet
}
function updateTextBalance() {
    balanceDisplay.textContent = balanceString.toLocaleString();
    totalBet.textContent = currentBetString.toLocaleString();
}

btnResetMoney.addEventListener('click', resetMoney);
function resetMoney() {
    balance = 10000;
    updateBalance();
    updateTextBalance();
    updateChipStates();
    btnResetMoney.classList.add('hidden');
    btnAllin.classList.remove('hidden');
    labelAllIn.textContent = "All-in";
}

btnAllin.addEventListener('click', allin);
function allin() {
    currentBet = balance + currentBet;
    balance = 0;
    updateBalance();
    updateTextBalance();
    btnBet.disabled = false;
    updateChipStates();
}

btnClear.addEventListener('click', clearBet);
function clearBet() {
    balance += currentBet;
    currentBet = 0;
    updateBalance();
    updateTextBalance();
    btnBet.disabled = true;
    updateChipStates();
}

let currentAnimationIndex = 0;
const animations = ['flip-card', 'slide-in', 'zoom', 'slide-down'];
btnBet.addEventListener('click', startHand);
function startHand(){
    if (currentBet == 0) return;

    localStorage.setItem('balance', balance);

    // Has the player enough balance to double?
    if (balance < currentBet) {
        btnDouble.disabled = true;
    } else {
        btnDouble.disabled = false;
    }

    //Change animations
    currentAnimationIndex++;
    if (currentAnimationIndex >= animations.length) {
        currentAnimationIndex = 0;
    }

    h2text.textContent = "Choose your action";

    toggleDisabled([btnInsurance, btnBet, btnClear, btnAllin], true);
    toggleElementVisibility([playerScore, dealerScore, btnHit, btnStand], false, 'invisible');

    chipSection.classList.add('hidden');
    labelAllIn.classList.add('opacity-20');
    labelClear.classList.add('opacity-20');
    textBalance.classList.add('opacity-20');

    handButtons.classList.remove('hidden');
    handButtons.classList.add('flex');

    updateBalance();
    updateTextBalance();

    dealerHand = [];
    playerHand = [giveCard(), giveCard()];
    dealerHand = [giveCard()];
    renderPlayerInitialHand() 
    renderDealerInitialHand() 

    // Is the dealer showing an Ace?
    if (dealerHand[0].value === 'A' && balance >= currentBet / 2) {
        btnInsurance.disabled = false;
    }

    // Check if player first hand is a blackjack
    if (calculateHandValue(playerHand) === 21 && playerHand.length === 2) {
        const playerHasBlackjack = true;

        toggleDisabled([btnHit, btnStand, btnDouble, btnInsurance], true);

        setTimeout(() => {
            stand(playerHasBlackjack);
        }, 1000);
        
    }
}

btnHit.addEventListener('click', hit);
function hit() {
    toggleDisabled([btnDouble, btnInsurance], true);
    playerHand.push(giveCard());
    updatePlayerHand();

    if (calculateHandValue(playerHand) > 21) {
        toggleDisabled([btnHit, btnStand], true);
        setTimeout( () => {
            showResult('lose', currentBet, "You went over 21!");
            disableActions();
        }, 1000);
        
    }
}

btnStand.addEventListener('click', stand);
async function stand(playerHasBlackjack) {
    // Dealer plays...
    toggleDisabled([btnHit, btnStand, btnDouble, btnInsurance], true);

    // Player has blackjack?
    if (playerHasBlackjack === true) {
        dealerHand.push(giveCard());
        updateDealerHand() 
        await sleep(500);
        updateScreen();
        whoWin();
        return
    }

    // Checks if insurance card was generated and shows it
    if (isInsuranceCardGenerated == true) {
        updateDealerHand();
        isInsuranceCardGenerated = false;
        givenCards += 1;
        givenCounter.innerHTML = `Cards given: <span class="text-blue-400 font-bold">${givenCards}</span>`;
        await sleep(1000);
    }

    // Dealer hit logic
    while (true) {
        const total = calculateHandValue(dealerHand);

        // less than 17? hit 
        if (total < 17) {
            dealerHand.push(giveCard());
            updateDealerHand() 
            await sleep(1000);
        }
        // is soft17? hit
        else if (total === 17 && isSoft17(dealerHand)) {
            dealerHand.push(giveCard());
            updateDealerHand()
            await sleep(1000);
        }
        // more than 17? stand
        else {
            break;
        }
    }
    dealerScore.classList.remove('invisible');

    updateScreen();
    await whoWin();
}

function isSoft17(hand) {
    let total = 0;
    let aces = 0;

    for (const card of hand) {
        if (card.value === "A") {
            total += 11;
            aces++;
        } else if (["K","Q","J"].includes(card.value)) {
            total += 10;
        } else {
            total += parseInt(card.value);
        }
    }

    return total === 17 && aces > 0;
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
    updateTextBalance();

    playerHand.push(giveCard());
    updatePlayerHand();

    toggleDisabled([btnHit, btnStand, btnDouble], true);

    // Automatically stand
    if (calculateHandValue(playerHand) > 21) {
        setTimeout( () => {
            showResult('lose', currentBet, "You went over 21!");
            disableActions();
        }, 1000);
        
    } else {
        setTimeout(() => {
            stand();
        }, 1000);
    }
}

let insuranceBet = 0;
btnInsurance.addEventListener('click', insurance);
function insurance() {
    const maxInsurance = Math.ceil(currentBet / 2);

    toggleDisabled([btnHit, btnStand, btnDouble], true);

    if (balance < maxInsurance) {
        btnInsurance.disabled = true;
        return;
    }

    insuranceBet = maxInsurance;
    balance -= maxInsurance;
    updateBalance();
    updateTextBalance();

    btnInsurance.disabled = true;
    givenCards -= 1;
    dealerHand.push(giveCard());

    if (calculateHandValue(dealerHand) == 21) {
        balance += Math.ceil(insuranceBet * 3);
        
        updateDealerHand();
        
        setTimeout(() => {
            updateBalance();
            showResult('insurance', Math.ceil(insuranceBet * 3), "Dealer has Blackjack.");
            disableActions();
        }, 1000);
        
    } else {
        insuranceBet = 0;
        setTimeout(() => {
            showResult('lose', maxInsurance, "Dealer doesn't have Blackjack.");
            toggleDisabled([btnHit, btnStand], false);

            balance < currentBet ? btnDouble.disabled = true : btnDouble.disabled = false;

            isInsuranceCardGenerated = true;
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

        if (window.innerWidth > 768) continue; // Only for small screens
        if (elementId === 'playerShow') {
            // Keeps the player scale if dealer hand has more cards
            cardDiv.style.zoom = currentPlayerCardScale;
            cardDiv.style.marginRight = `${5 * currentPlayerCardScale}px`;
        } else {
            cardDiv.style.zoom = currentDealerCardScale;
            cardDiv.style.marginRight = `${5 * currentDealerCardScale}px`;
        }
        cardDiv.style.marginTop = "0px"
        cardDiv.style.transformOrigin = 'center';
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

function createDeck(numberOfDecks = 2) {
    deck = [];
    for (let i = 0; i < numberOfDecks; i++) {
        for (const suit of suits) {
            for (const value of values) {
                deck.push({value, suit});
            }
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
let givenCards = 0;
function giveCard(){
    if (deck.length <= 20) {
        isDeckLow = true;
    }
    givenCards += 1;
    givenCounter.innerHTML = `Cards given: <span class="text-blue-400 font-bold">${givenCards}</span>`;

    remainingCounter.innerHTML = `Remaining: <span class="text-green-400 font-bold">${deck.length - 1}</span>`;

    return deck.pop();
}

function updateScreen() {
    renderHand(playerHand, 'playerShow');
    renderHand(dealerHand, 'dealerShow');

    playerScore.innerHTML = `Hand value: ${calculateHandValue(playerHand)}`;
    dealerScore.innerHTML = `Hand value: ${calculateHandValue(dealerHand)}`;
}

function updatePlayerHand() {
    const newCard = playerHand[playerHand.length - 1]
    
    renderSingleCard(newCard, 'playerShow', true);

    playerScore.innerHTML = `Hand value: ${calculateHandValue(playerHand)}`;

    adjustCardScale('playerShow');
}

function updateDealerHand() {

    const newCard = dealerHand[dealerHand.length - 1]
    renderSingleCard(newCard, 'dealerShow', true);

    dealerScore.innerHTML = `Hand value: ${calculateHandValue(dealerHand)}`;

    adjustCardScale('dealerShow');
}
let currentPlayerCardScale = 1;
let currentDealerCardScale = 1;
function adjustCardScale(containerId) {

    // Only for small screens
    if (window.innerWidth > 768) return; 

    const container = document.getElementById(containerId);
    if (!container) return;

    const cards = container.querySelectorAll('.card');
    if (cards.length === 0) return;

    const maxWidth = container.offsetWidth;
    const totalWidth = cards.length * 85; // Estimating each card width + margin
    console.log(`Total card width: ${totalWidth}px, Container width: ${maxWidth}px`);
    const scale = totalWidth > maxWidth ? maxWidth / totalWidth : 1;
    console.log(`Scale factor: ${scale}`);

    if (totalWidth > maxWidth) {
        cards.forEach(card => {
            card.style.zoom = scale;
            card.style.marginRight = `${5 * scale}px`;
            card.style.marginTop = "0px"
            card.style.transformOrigin = 'center';
        });
        if (containerId === 'playerShow') {
            currentPlayerCardScale = scale;
        } else {
            currentDealerCardScale = scale;
        }
    }
    
}


function renderSingleCard(card, elementId, animate = false) {
    const container = document.getElementById(elementId);

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');

    if (animate) {
        cardDiv.classList.add(animations[currentAnimationIndex]); 
    }

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
function renderPlayerInitialHand() {
    const container = document.getElementById('playerShow');
    container.innerHTML = '';

    playerHand.forEach(card => renderSingleCard(card, 'playerShow', true));
    playerScore.innerHTML = `Hand value: ${calculateHandValue(playerHand)}`;
}
function renderDealerInitialHand() {
    const container = document.getElementById('dealerShow');
    container.innerHTML = '';

    dealerHand.forEach(card => renderSingleCard(card, 'dealerShow', true));
    dealerScore.innerHTML = `Hand value: ${calculateHandValue(dealerHand)}`;
}

async function whoWin() {
    const playerTotal = calculateHandValue(playerHand);
    const dealerTotal = calculateHandValue(dealerHand);

    await sleep(500); 

    if (playerTotal == 21 && playerHand.length == 2  && !(dealerTotal === 21 && dealerHand.length === 2)) {
        balance += Math.floor(currentBet * 2.5);
        updateBalance();
        showResult('win', Math.floor(currentBet * 2.5), "Blackjack!");
        disableActions();
        return;
    }
    if (dealerTotal == 21 && dealerHand.length == 2 && !(playerTotal === 21 && playerHand.length === 2)){
        
        showResult('lose', currentBet, "Dealer has Blackjack!");
        
        disableActions();
        return;
    }

    if (dealerTotal > 21) {
        console.log("El dealer se pasó. ¡Ganas!");
        balance += currentBet * 2;
        updateBalance();
        
            showResult('win', currentBet * 2, "Dealer busts!");
        
    } else if (playerTotal > dealerTotal) {
        console.log("¡Le ganas al Dealer!");
        balance += currentBet * 2;
        updateBalance();
        
            showResult('win', currentBet * 2, "You beat the Dealer!");
        
    } else if (playerTotal < dealerTotal) {
        console.warn("¡Pierdes!");
        
            showResult('lose', currentBet, "Dealer wins this hand!");
        
    } else {
        console.info("Push!");
        balance += currentBet;
        updateBalance();
        
            showResult('tie', 0, "Push!");
        
        
    }
    disableActions();
}

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
    } else if (result === 'newDeck'){
        resultTitle.textContent = 'Cards are getting low!';
        resultTitle.className = 'mb-4 text-2xl font-bold text-purple-700 2xl:text-3xl';
        resultMessage.textContent = comment;
        resultAmount.textContent = ``;
        resultAmount.className = 'hidden';
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
    textBalance.classList.remove('opacity-20');
    updateTextBalance();
});


function disableActions() {
    toggleDisabled([btnHit, btnStand, btnDouble, btnInsurance], true);
    
    setTimeout(() => {
        h2text.textContent = "Play another hand";
        handButtons.classList.add('hidden');
        controls.classList.remove('justify-between');
        controls.classList.add('justify-center');
        btnNextHand.classList.remove('hidden');
        btnNextHand.classList.add('flex');
    }, 1);
    
}

btnNextHand.addEventListener('click', startGame);
function enableActions() {
    toggleDisabled([btnHit, btnStand], false);
    btnHit.classList.remove('opacity-20');
    btnStand.classList.remove('opacity-20');
    handButtons.classList.remove('hidden');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function toggleElementVisibility(elements, hide = true, type = 'hidden') {
    // True to hide, false to show
    if (!Array.isArray(elements)) elements = [elements];
    
    elements.forEach(element => {
        if (hide) {
            element.classList.add(type);
        } else {
            element.classList.remove(type);
        }
    });
}

function toggleDisabled(elements, state) { 
    // True to disable, false to enable
    if (!Array.isArray(elements)) elements = [elements];
    elements.forEach(element => {
        element.disabled = state;
    });
}