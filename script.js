const btnGenerate = document.getElementById('btnGenerate');

btnGenerate.addEventListener('click', generateCard);

function generateCard() {
    createDeck();
    shuffleDeck();
    let card = giveCard();
    console.log(card);
    number.innerHTML = card.suit + card.value;
}

const suits = ['♠','♣','♦','♥'];
const values = ['A','K','Q','J','10','9','8','7','6','5','4','3','2'];
let deck = [];

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
