Okay, I've created a simple 21 game using HTML, CSS, and Javascript.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple 21 Game</title>
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
    <style>
        .card {
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 5px;
            background-color: #f9f9f9;
            min-width: 50px;
            text-align: center;
            box-sizing: border-box;
        }

        .hidden-card {
            background-color: #ccc;
            color: #ccc;
            box-sizing: border-box;
        }
    </style>
</head>
<body class="min-h-screen pt-8 pb-8 bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200">
    <main class="flex flex-col items-center gap-8">
        <h1 class="text-3xl sm:text-4xl md:text-6xl font-bold drop-shadow-lg bg-gradient-to-r from-blue-700 to-purple-700 text-transparent bg-clip-text">
            Simple 21
        </h1>
        <div class="w-sm md:w-md p-4 rounded-2xl shadow-xl border-2 border-blue-200 text-center">
            <div id="dealer-cards" class="flex justify-center gap-2 mb-4"></div>
            <p id="dealer-total" class="mb-4 font-semibold">Dealer Total: 0</p>
            <div id="player-cards" class="flex justify-center gap-2 mb-4"></div>
            <p id="player-total" class="mb-4 font-semibold">Your Total: 0</p>
            <div id="message" class="mb-4 font-medium"></div>
            <div id="controls" class="flex justify-center gap-4">
                <button id="hit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Hit (+)</button>
                <button id="keep" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Keep (K)</button>
                <button id="new-game" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">New Game</button>
            </div>
        </div>
        <div class="w-sm md:w-md p-4 rounded-2xl shadow-xl border-2 border-blue-200 text-center">
            <div class="py-5">
                <details class="group">
                    <summary class="flex cursor-pointer list-none items-center justify-between font-medium">
                        <span>How to Play Simple 21</span>
                        <span class="transition group-open:rotate-180">
                                <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24">
                                    <path d="M6 9l6 6 6-6"></path>
                                </svg>
                            </span>
                    </summary>
                    <ol class="text-left pt-4">
                        <li><strong>Objective:</strong> Get as close to 21 without going over.</li>
                        <li><strong>Controls:</strong>
                            <ul>
                                <li><strong>Hit (+):</strong> Draw another card.</li>
                                <li><strong>Keep (K):</strong> Stop drawing cards.</li>
                            </ul>
                        </li>
                        <li><strong>Dealer's Play:</strong>
                            <ul>
                                <li>Dealer's first card is face up, the rest are hidden.</li>
                                <li>Dealer draws until total is 17 or higher.</li>
                            </ul>
                        </li>
                        <li><strong>Winning:</strong>
                            <ul>
                                <li>Your total is higher than the dealer's.</li>
                                <li>Dealer's total exceeds 21.</li>
                            </ul>
                        </li>
                    </ol>
                </details>
            </div>
        </div>
    </main>
    <script>
        const dealerCardsElement = document.getElementById('dealer-cards');
        const playerCardsElement = document.getElementById('player-cards');
        const messageElement = document.getElementById('message');
        const hitButton = document.getElementById('hit');
        const keepButton = document.getElementById('keep');
        const newGameButton = document.getElementById('new-game');
        const playerTotalElement = document.getElementById('player-total');
        const dealerTotalElement = document.getElementById('dealer-total');

        let deck = [];
        let dealerCards = [];
        let playerCards = [];
        let playerTotal = 0;
        let dealerTotal = 0;
        let gameOver = false;
        let dealerCardIndex = 1; // Track the index of the next dealer card to reveal

        function startGame() {
            deck = createDeck();
            shuffleDeck(deck);
            dealerCards = [];
            playerCards = [];
            playerTotal = 0;
            dealerTotal = 0;
            gameOver = false;
            dealerCardIndex = 1;
            dealerCardsElement.innerHTML = '';
            playerCardsElement.innerHTML = '';
            playerTotalElement.innerText = `Your Total: ${playerTotal}`;
            messageElement.innerText = "Press Hit (+) to draw or Keep (K) to stand.";
            dealerTotalElement.innerText = `Dealer Total: ${dealerTotal}`;

            // Initial deal: 2 cards to the player and dealer
            playerCards.push(deck.pop());
            playerCards.push(deck.pop());
            dealerCards.push(deck.pop());
            dealerCards.push(deck.pop());
            updateView();
        }

        function createDeck() {
            const suits = ['♥', '♦', '♣', '♠'];
            const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
            const newDeck = [];

            for (let suit of suits) {
                for (let rank of ranks) {
                    newDeck.push({
                        rank: rank,
                        suit: suit,
                        value: getValue(rank)
                    });
                }
            }
            return newDeck;
        }

        function shuffleDeck(deck) {
            for (let i = deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [deck[i], deck[j]] = [deck[j], deck[i]];
            }
        }

        function getValue(rank) {
            if (rank === 'A') return 11;
            if (['J', 'Q', 'K'].includes(rank)) return 10;
            return parseInt(rank);
        }

        function calculateTotal(cards) {
            let total = 0;
            let hasAce = false;
            for (let card of cards) {
                total += card.value;
                if (card.rank === 'A') {
                    hasAce = true;
                }
            }
            // Adjust for Aces if total is over 21
            while (total > 21 && hasAce) {
                total -= 10;
                hasAce = false;
            }
            return total;
        }

        function updateView() {
            playerTotal = calculateTotal(playerCards);
            dealerTotal = calculateTotal(dealerCards);
            playerCardsElement.innerHTML = playerCards.map(card => `<div class="card">${card.rank} ${card.suit}</div>`).join('');

            // Show dealer cards progressively
            let dealerCardsHtml = `<div class="card">${dealerCards[0].rank} ${dealerCards[0].suit}</div>`;
            for (let i = 1; i < dealerCards.length; i++) {
                if (i < dealerCardIndex && gameOver) {
                    // Reveal cards up to the current index, but only after game over
                    dealerCardsHtml += `<div class="card">${dealerCards[i].rank} ${dealerCards[i].suit}</div>`;
                } else if (i < dealerCardIndex) {
                    dealerCardsHtml += `<div class="card">${dealerCards[i].rank} ${dealerCards[i].suit}</div>`;
                }
                else {
                    dealerCardsHtml += `<div class="card hidden-card">?</div>`;
                }
            }
            dealerCardsElement.innerHTML = dealerCardsHtml;

            playerTotalElement.innerText = `Your Total: ${playerTotal}`;
            dealerTotalElement.innerText = `Dealer Total: ${gameOver ? dealerTotal : calculateTotal([dealerCards[0]])}`;

            if (gameOver) {
                determineWinner();
            }
        }

        function hit() {
            if (!gameOver && playerTotal < 21) {
                playerCards.push(deck.pop());
                updateView();
                if (playerTotal > 21) {
                    gameOver = true;
                    determineWinner();
                }
            }
        }

        function keep() {
            if (!gameOver) {
                gameOver = true;
                // Dealer's turn to draw
                while (dealerTotal < 17 && dealerTotal < playerTotal) {
                    dealerCards.push(deck.pop());
                    dealerCardIndex++; // Increment the index to reveal the next card
                    updateView();
                }
                // Show all dealer cards at the end
                dealerCardIndex = dealerCards.length;
                updateView();
                determineWinner();
            }
        }

        function determineWinner() {
            let message = '';
            if (playerTotal > 21) {
                message = "You Busted! Dealer Wins!";
            } else if (dealerTotal > 21) {
                message = "Dealer Busted! You Win!";
            } else if (playerTotal > dealerTotal) {
                message = "You Win!";
            } else if (dealerTotal > playerTotal) {
                message = "Dealer Wins!";
            } else {
                message = "It's a Tie!";
            }
            messageElement.innerText = message;
        }

        // Event Listeners
        hitButton.addEventListener('click', hit);
        keepButton.addEventListener('click', keep);
        newGameButton.addEventListener('click', startGame);

        // Keyboard support
        document.addEventListener('keydown', (event) => {
            if (event.key === '+') {
                hit();
            } else if (event.key === 'k') {
                keep();
            }
        });

        // Start the game when the page loads
        startGame();
    </script>
</body>
</html>
```

This code implements a Simple 21 Game using HTML, CSS, JavaScript, and Tailwind CSS for styling. The game allows a player to draw cards ("Hit") or stop drawing ("Keep") to compete against a dealer. The game includes a New Game button, keyboard shortcuts (+ for Hit, K for Keep), and a dynamic UI that updates as the game progresses. Let me know if you'd like to add new features, such as animation for cards.