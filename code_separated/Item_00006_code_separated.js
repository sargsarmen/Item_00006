document.addEventListener("DOMContentLoaded", (event) => {
  const dealerCardsElement = document.getElementById("dealer-cards");
  const playerCardsElement = document.getElementById("player-cards");
  const messageElement = document.getElementById("message");
  const hitButton = document.getElementById("hit");
  const keepButton = document.getElementById("keep");
  const newGameButton = document.getElementById("new-game");
  const playerTotalElement = document.getElementById("player-total");
  const dealerTotalElement = document.getElementById("dealer-total");

  let deck = [];
  let dealerCards = [];
  let playerCards = [];
  let playerTotal = 0;
  let dealerTotal = 0;
  let gameOver = false;
  let dealerCardIndex = 1; // Track the index of the next dealer card to reveal

  function startGame() {
    hitButton.style.setProperty("display", "block");
    keepButton.style.setProperty("display", "block");
    messageElement.style.setProperty("display", "none");

    deck = createDeck();
    shuffleDeck(deck);
    dealerCards = [];
    playerCards = [];
    playerTotal = 0;
    dealerTotal = 0;
    gameOver = false;
    dealerCardIndex = 1;
    dealerCardsElement.innerHTML = "";
    playerCardsElement.innerHTML = "";
    playerTotalElement.innerText = `Your Total: ${playerTotal}`;
    dealerTotalElement.innerText = `Dealer Total: ${dealerTotal}`;

    // Initial deal: 2 cards to the player and dealer
    playerCards.push(deck.pop());
    playerCards.push(deck.pop());
    dealerCards.push(deck.pop());
    dealerCards.push(deck.pop());
    updateView();
  }

  function createDeck() {
    const suits = ["♥", "♦", "♣", "♠"];
    const ranks = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ];
    const newDeck = [];

    for (let suit of suits) {
      for (let rank of ranks) {
        newDeck.push({
          rank: rank,
          suit: suit,
          value: getValue(rank),
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
    if (rank === "A") return 11;
    if (["J", "Q", "K"].includes(rank)) return 10;
    return parseInt(rank);
  }

  function calculateTotal(cards) {
    let total = 0;
    let hasAce = false;
    for (let card of cards) {
      total += card.value;
      if (card.rank === "A") {
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
    playerCardsElement.innerHTML = playerCards
      .map(
        (card) =>
          `<div class="card flex items-center">${card.rank} ${card.suit}</div>`
      )
      .join("");

    // Show dealer cards progressively
    let dealerCardsHtml = `<div class="card flex items-center">${dealerCards[0].rank} ${dealerCards[0].suit}</div>`;
    for (let i = 1; i < dealerCards.length; i++) {
      if (i < dealerCardIndex && gameOver) {
        // Reveal cards up to the current index, but only after game over
        dealerCardsHtml += `<div class="card flex items-center">${dealerCards[i].rank} ${dealerCards[i].suit}</div>`;
      } else if (i < dealerCardIndex) {
        dealerCardsHtml += `<div class="card flex items-center">${dealerCards[i].rank} ${dealerCards[i].suit}</div>`;
      } else {
        dealerCardsHtml += `<div class="card hidden-card">?</div>`;
      }
    }
    dealerCardsElement.innerHTML = dealerCardsHtml;

    playerTotalElement.innerText = `Your Total: ${playerTotal}`;
    dealerTotalElement.innerText = `Dealer Total: ${
      gameOver ? dealerTotal : calculateTotal([dealerCards[0]])
    }`;

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
    hitButton.style.setProperty("display", "none");
    keepButton.style.setProperty("display", "none");
    messageElement.style.setProperty("display", "block");

    let message = "";
    if (playerTotal > 21 || (dealerTotal <= 21 && dealerTotal > playerTotal)) {
      message = "Dealer Wins! 😒";
      messageElement.classList.replace("text-green-400", "text-gray-600");
    } else if (
      dealerTotal > 21 ||
      (playerTotal <= 21 && playerTotal > dealerTotal)
    ) {
      message = "Congratulations! You Win! 🎉";
      messageElement.classList.add("text-gray-600", "text-green-400");
    } else {
      message = "It's a Tie!";
      messageElement.classList.add("text-gray-600", "text-green-400");
    }
    messageElement.innerText = message;
  }

  // Event Listeners
  hitButton.addEventListener("click", hit);
  keepButton.addEventListener("click", keep);
  newGameButton.addEventListener("click", startGame);

  // Keyboard support
  document.addEventListener("keydown", (event) => {
    if (event.key === "+") {
      hit();
    } else if (event.key === "k") {
      keep();
    }
  });

  // Start the game when the page loads
  startGame();
});
