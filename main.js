/**
 * This is the JS to implement the UI and acutal game for my Blackjack website. It creates
 * a dealer opponent (whose behavior is programed with JS), and takes in user input to play
 * the game.
 */

(function() {
  "use strict";

  const IMG_PRE = "card-img/";
  const IMG_POST = ".png";
  const CREDIT_WIN = 15;
  const CREDIT_LOST = 5;
  const BUST_VAL = 21;
  const ACE_UP = 11;
  const ACE_LOW = 1;
  const FACE_VAL = 10;
  const DEAL_MAX = 17;
  let deckCards = ["ace_of_hearts","2_of_hearts","3_of_hearts","4_of_hearts","5_of_hearts",
  "6_of_hearts","7_of_hearts","8_of_hearts","9_of_hearts","10_of_hearts","jack_of_hearts",
  "queen_of_hearts","king_of_hearts","ace_of_clubs","2_of_clubs","3_of_clubs","4_of_clubs",
  "5_of_clubs","6_of_clubs","7_of_clubs","8_of_clubs","9_of_clubs","10_of_clubs","jack_of_clubs",
  "queen_of_clubs","king_of_clubs","ace_of_diamonds","2_of_diamonds","3_of_diamonds",
  "4_of_diamonds","5_of_diamonds","6_of_diamonds","7_of_diamonds","8_of_diamonds","9_of_diamonds",
  "10_of_diamonds","jack_of_diamonds","queen_of_diamonds","king_of_diamonds","ace_of_spades",
  "2_of_spades","3_of_spades","4_of_spades","5_of_spades","6_of_spades","7_of_spades","8_of_spades",
  "9_of_spades","10_of_spades","jack_of_spades","queen_of_spades","king_of_spades"];
  let playerHand = [];
  let playerValue = 0;
  let dealerHand = [];
  let dealerValue = 0;
  let credits = 200;
  let busted = false;
  let blackjack = false;

  window.addEventListener("load", initialize);

  /** Initializes the page, hides the game displays, and adds the button to begin the game */
  function initialize() {
    let dealButton = id("deal");
    let bustView = id("bust-view");
    let board = id("board");
    dealButton.addEventListener("click", initialDeal);
    bustView.classList.add("hidden");
    board.classList.add("hidden");

  }

  /**
   * This function emulates the initial dealing of two cards into the player's hand.
   * It also sets up the game board interface with subsequent game controls.
   */
  function initialDeal() {
    let hitButton = id("hit");
    let standButton = id("stand");
    let playButton = id("play-again");
    let exitButton = id("stop-playing");
    let controls = id("controls");
    let board = id("board");
    id("deal").classList.add("hidden");
    id("rules").classList.add("hidden");
    createCardPlayer();
    createCardPlayer();
    controls.classList.remove("hidden");
    board.classList.remove("hidden");
    board.classList.add("flex");
    hitButton.addEventListener("click", createCardPlayer);
    standButton.addEventListener("click", dealerPlay);
    playButton.addEventListener("click", playAgain);
    exitButton.addEventListener("click", endGame);
  }

  /**
   * Draws into the player's hand a singular card and removes it from the deck.
   * @returns {string} card - String representation of the card, e.g. "7_of_clubs"
   */
  function drawCardHand() {
    let card = drawRandCard();
    playerHand.push(card);
    deckCards.splice(deckCards.indexOf(card), 1);
    return card;
  }

  /**
   * Selects a random card from the deck.
   * @returns {string} deckCards[cardIndex] String representation of the card, e.g. "7_of_clubs"
   */
  function drawRandCard() {
    let deckSize = deckCards.length;
    let cardIndex = Math.floor(Math.random() * deckSize);
    return deckCards[cardIndex];
  }

  /**
   * Draws into the dealer's hand a singular card and removes it from the deck.
   * @returns {string} String representation of the card, e.g. "7_of_clubs"
   */
  function drawCardDeal() {
      let card = drawRandCard();
      dealerHand.push(card);
      deckCards.splice(deckCards.indexOf(card), 1);
      return card;
  }

  /**
   * Emulates the dealer's turn in Blackjack. They will draw cards into their hand
   * until their hand's value is greater than or equal to 17. Also kicks off the next
   * phase of the game of comparing and declaring a winner.
   */
  function dealerPlay() {
    while (dealerValue < DEAL_MAX) {
      let card = drawCardDeal();
      let img = createImg(card);
      id("dealer").appendChild(img);
      dealerValue = sumCardValues(dealerHand);
    }
    specialHandDetect();
    winnerDeclare();
  }

  /**
   * Creates an image element of the card with the correct src and alt tags.
   * @param {string} card - the card whose image will be created
   * @returns {img} img - image element that was created
   */
  function createImg(card) {
    let img = document.createElement('img');
    let cardUrl = card + IMG_POST;
    let imgUrl = IMG_PRE + cardUrl;
    img.src = imgUrl;
    img.alt = card;
    return img;
  }

  /**
   * Creates a card that is to be placed into the player's hand and displayed on screen.
   * If the player busts, the player's turn ends allowing the dealer to take their turn.
   */
  function createCardPlayer() {
    let card = drawCardHand();
    let img = createImg(card);
    id("player").appendChild(img);
    playerValue = sumCardValues(playerHand);
    if (playerValue > BUST_VAL) {
      dealerPlay();
    }
  }

  /**
   * Takes in the given hand then calculates and returns the sum of the card values (e.g. Jack = 10)
   * Also deals with the case of deciding whether an Ace should be counted at a value of 1 or 11.
   * @param {String[]} cardArray - the given hand/array of cards to be parsed
   * @returns {int} sum - the total hand value of the cards
   */
  function sumCardValues(cardArray) {
    let sum = 0;
    for (let i = 0; i < cardArray.length; i++) {
      let card = cardArray[i];
      let cardNumber = card.substring(0, 1);
      if (cardNumber === "1" || cardNumber === "j" || cardNumber === "q" || cardNumber === "k") {
        sum += FACE_VAL;
      } else if (cardNumber === "a") {
        if (i > 2 && sum <= 11) {
          sum += ACE_UP;
        } else {
          sum += ACE_LOW;
        }
      } else {
        sum += parseInt(cardNumber);
      }
    }
    return sum;
  }

  /** Detects whether the player has busted or got Blackjack. */
  function specialHandDetect() {
    if (playerValue > BUST_VAL) {
      busted = true;
    } else if (playerValue === BUST_VAL) {
      blackjack = true;
    }
    let controls = id("controls");
    let bustView = id("bust-view");
    bustView.classList.remove("hidden");
    controls.classList.add("hidden");
    let spec = qs("#bust-view h1");
    if (busted) {
      spec.textContent = "BUSTED";
    } else if (blackjack) {
      spec.textContent = "BLACKJACK";
    } else {
      spec.textContent = "";
    }
  }

  /**
    * Resets the game board back to its original state and returns the card in play to
    * the card deck.
    */
  function resetBoard() {
    let bustView = id("bust-view");
    bustView.classList.add("hidden");
    let hand = id("player");
    while (hand.firstChild) {
      hand.removeChild(hand.firstChild);
    }
    let dealer = id("dealer");
    while (dealer.firstChild) {
      dealer.removeChild(dealer.firstChild);
    }
    id("playing-cards").classList.remove("hidden");
    resetGameValues();
  }

  /** Resets the instance values of the game and adds the cards in play back to the deck. */
  function resetGameValues() {
    while (playerHand.length !== 0) {
      deckCards.push(playerHand.pop());
    }
    while (dealerHand.length !== 0) {
      deckCards.push(dealerHand.pop());
    }
    busted = false;
    blackjack = false;
    playerValue = 0;
    dealerValue = 0;
  }

  /** Resets the game and initializes another round of it. */
  function playAgain() {
    resetBoard();
    initialDeal();
  }

  /**
    * Determines whether the player or dealer won the game. Also adds or subtracts from the
    * players total credits depending on the winner. If the player runs out of credits the game
    * will end.
    */
  function winnerDeclare() {
    let winner;
    if (playerValue > BUST_VAL) {
      winner = "You lost!"; //dealer
      credits -= CREDIT_LOST;
      //player loses
    } else if (playerValue === dealerValue) {
      winner = "It's a tie!"; // no one
      // its a tie no money lost/gained
    } else {
      if (playerValue === BUST_VAL) {
        winner = "You won!"; // player
        credits += CREDIT_WIN;
      } else if (playerValue > dealerValue) {
        winner = "You won!"; // player
        credits += CREDIT_WIN;
      } else {
        winner = "You lost!"; // dealer
        credits -= CREDIT_LOST;
      }
    }
    if (credits < 0) {
      endGame();
    }
    qs("#controls p").textContent = "Credits: " + credits;
    qs("#bust-view p").textContent = winner;
  }

  /** Ends the game and thanks the player for playing. */
  function endGame() {
    resetBoard();
    let board = id("board");
    id("game").classList.add("hidden");
    board.classList.add("hidden");
    qs("footer").classList.add("hidden");
    board.classList.remove("flex");
    qs("main > section + section").classList.remove("hidden");
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }
})();
