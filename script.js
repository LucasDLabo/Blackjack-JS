const btnGenerate = document.getElementById('btnGenerate');

let playerHand = [];
let dealerHand = [];

const suits = ['♠','♣','♦','♥'];
const values = ['A','K','Q','J','10','9','8','7','6','5','4','3','2'];
let deck = [];

createDeck();
shuffleDeck();

btnGenerate.addEventListener('click', generateCard);

function generateCard() {
    if (deck.length === 0) {
        console.log("No cards left");
        return;
    }
    const card = giveCard();
    playerHand.push(card);
    renderHand(playerHand, 'playerShow');
    
    console.log(`Hand Points: ${calculateHandValue(playerHand)}`);
}

function renderHand(hand, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';

    for (const card of hand) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');

        // Agregar color por palo
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

    // Ajustar los As si el total supera 21
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
