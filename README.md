# *🃏 BlackjackJS*


**BlackjackJS** is a browser-based Blackjack game developed entirely in **Vanilla JavaScript**, born as a learning project and refined into a fully playable and polished product.

This project was originally intended to strengthen my understanding of core JavaScript concepts — DOM manipulation, event handling, and state management — but it evolved into a complete, responsive, and functional browser game.

## ✨ Features
- 🎮 **Fully playable Blackjack logic** — Including betting, hitting, standing, doubling down, and insurance
- 🎇 **Responsive UI and visual feedback** — Subtle animations, transitions, and interaction feedback for both desktop and mobile devices.
- 🔮 **QoL features** — Such as card counting, player and dealer hand value, unaffordable casino chips indication, All-in and Clear bet buttons.
## 🔱 The triad
<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" width="80" alt="HTML" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="80" alt="Tailwind CSS"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" width="80" alt="JavaScript"/>
</p>

## 🚀 Live Demo
*Click the GIF below to play!*
<p align="center">
  <a href="https://lucasdlabo.github.io/Blackjack-JS/" target="_blank">
    <img src="/readme/preview.gif" alt="Blackjack Demo" width="1000" style="border: 5px solid darkslategray; border-radius: 10px; box-shadow: 7px 7px 5px 0px rgba(0,0,0,0.75);">
  </a>
</p>

---

## 🧠 Lessons Learned
Interesting concepts worth showing 
1. ***UI management using only DOM manipulation***
    ```
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
    ```
    > Handles chip clicks to place bets and update balance
2. ***Use of async functions to give the player time to see what's happening***
    ```
    btnStand.addEventListener('click', stand);
    async function stand(playerHasBlackjack) {
    // Dealer plays...
    toggleDisabled([btnHit, btnStand, btnDouble, btnInsurance], true);
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
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    ```
    > Dealer logic using await to simulate natural pauses between moves
3. ***How to combine both design and resposiveness to provide a pleasant experience***
    ```
    // Adjust card scale for small screens when there are too many cards
    if (window.innerWidth > 768) continue;
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
    ```
    > Mobile-only adjustment to avoid card clipping and overflow
4. ***A general refresh of fundamental web programming concepts***
    ```
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
    ```
    > Function to create and shuffle 2 decks usign Fisher–Yates algorithm

---

## 🎮 How to play Blackjack

- The goal is to reach **21 points** without going over, and to have **more points than the dealer**.
- Number cards are worth their face value, face cards are worth **10**, and the Ace counts as **1 or 11**.
- The **dealer** must draw cards until reaching **17 points**.
- This game uses **2 decks**, so keep in mind which cards have already been drawn.

---

🤗 Thanks for reading! 




