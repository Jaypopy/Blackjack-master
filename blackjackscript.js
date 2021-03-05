"use strict";

let numCardsPulled = 0;
let dealerNumCardsPulled = 0;

let player = {
    cards: [],
    score: 0,
    money: 100
};

let dealer = {
    cards: [],
    score: 0
};

let deck = {
    deckArray: [],
    initialize () {
        let suitArray, rankArray, s, r;
        suitArray = ["clubs", "diamonds", "hearts", "spades"];
        rankArray = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];
        for (s = 0; s < suitArray.length; s++) {
            for (r = 0; r < rankArray.length; r++) {
                this.deckArray[s * 13 + r] = {
                    rank: rankArray[r],
                    suit: suitArray[s]
                    
                };
                
            }
        }
    },
    shuffle: function () {
        let temp, i, rnd;
        for (i = 0; i < this.deckArray.length; i++) {
            rnd = Math.floor(Math.random() * this.deckArray.length);
            temp = this.deckArray[i];
            this.deckArray[i] = this.deckArray[rnd];
            this.deckArray[rnd] = temp;
        }
    }
};

document.getElementById("player-money").innerHTML = "Balance: $" + player.money;

deck.initialize();
deck.shuffle();

function getCardsValue(a) {
    let cardArray = a;
    let sum = 0;
    let aceCount = 0;
    for (let i = 0; i < cardArray.length; i++) {
        if (cardArray[i].rank === "J" || cardArray[i].rank === "Q" || cardArray[i].rank === "K") {
            sum += 10;
        } else if (cardArray[i].rank === "A") {
            sum += 11;
            aceCount ++;
        } else {
            sum += cardArray[i].rank;
        }
    }
    while (aceCount > 0 && sum > 21) {
        sum -= 10;
        aceCount--;
    }
    return sum;
}

function printCards(rank, suit, who)
{
    let img = document.createElement('img');
    let imgSrc = "./carddeck/";
    switch(rank) {
        case "A":
            imgSrc += "A";
        break;
        case "K":
            imgSrc += "K";
        break;
        case "Q":
            imgSrc += "Q";
        break;
        case "J":
            imgSrc += "J";
        break;
        default:
            imgSrc += rank;
        break;
    }
    switch (suit) {
        case "clubs": 
            imgSrc += "C";
        break;
        case "diamonds":
            imgSrc += "D"
        break;
        case "hearts":
            imgSrc += "H"
        break;
        case "spades":
            imgSrc += "S"
        break;
            default:
                break;

    }
    imgSrc += ".png"

    img.setAttribute("src", imgSrc);
    document.getElementById(who +"-picture").append(img);    
    console.log(img);
}

function bet(outcome) {
    let playerBet = document.getElementById("bet").valueAsNumber;
    if (outcome === "win") {
        player.money += playerBet;
    }
    if (outcome === "lose") {
        player.money -= playerBet;
    }
    if (outcome ==="blackjack") {
        player.money += playerBet * 1.5;
    }
}

function resetGame() {
    numCardsPulled = 0;
    dealerNumCardsPulled = 0;
    player.cards = [];
    dealer.cards = [];
    player.score = 0;
    dealer.score = 0;
    deck.initialize();
    deck.shuffle();
    document.getElementById("hit-button").disabled = true;
    document.getElementById("stand-button").disabled = true;
    document.getElementById("bet").disabled = false;
    document.getElementById("bet").max = player.money;
    document.getElementById("new-game-button").disabled = false;
}

function gameOver() {
    if(player.score === 21 && numCardsPulled == 3)
    {
        document.getElementById("text-message").innerHTML = "You win! You got blackjack.";
        bet("blackjack");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money * 1.5;
        resetGame();
    }

    if (player.score === 21) {
        if (dealer.score > 21)
        {
            document.getElementById("text-message").innerHTML = "You win!";
            bet("win");
            document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
            resetGame();
        }
    }

    if (player.score > 21) {
        document.getElementById("text-message").innerHTML = "You went over 21! The dealer wins";
        bet("lose");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    if (dealer.score === 21) {
        if (dealerNumCardsPulled == 2)
        {
            document.getElementById("text-message").innerHTML = "You lost. Dealer got blackjack";
            bet("lose");
            document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
            resetGame();
        }
      else if (player.score == dealer.score)
      {
        document.getElementById("text-message").innerHTML = "You pushed. Both of you got 21.";
        resetGame();
      }
      else
      {
        document.getElementById("text-message").innerHTML = "You lost. Dealer got 21.";
        bet("lose");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
      }
    }
    if (dealer.score > 21) {
        document.getElementById("text-message").innerHTML = "Dealer went over 21! You win!";
        bet("win");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    if (dealer.score >= 17 && player.score > dealer.score && player.score <= 21) {
        document.getElementById("text-message").innerHTML = "You win! You beat the dealer.";
        bet("win");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    if (dealer.score >= 17 && player.score < dealer.score && dealer.score < 21) {
        document.getElementById("text-message").innerHTML = "You lost. Dealer had the higher score.";
        bet("lose");
        document.getElementById("player-money").innerHTML = "Your money: $" + player.money;
        resetGame();
    }
    if (dealer.score >= 17 && player.score === dealer.score && dealer.score < 21) {
        document.getElementById("text-message").innerHTML = "You pushed! ";
        resetGame();
    }
    if (player.money <= 0) {
        document.getElementById("new-game-button").disabled = true;
        document.getElementById("hit-button").disabled = true;
        document.getElementById("stand-button").disabled = true;
        document.getElementById("text-message").innerHTML = "You lost!" + "<br>" + "You are out of money" + "<br>" + "<input type='button' value='New Game' onclick='location.reload();'/>";
    }
}

function dealerDraw() {
    dealer.cards.push(deck.deckArray[numCardsPulled]);
    dealer.score = getCardsValue(dealer.cards);
    document.getElementById("dealer-score").innerHTML = "Dealer Score: " + dealer.score;
    numCardsPulled += 1;
    dealerNumCardsPulled += 1;
    dealer.score = getCardsValue(dealer.cards);
    document.getElementById("dealer-picture").innerHTML = "";
    dealer.cards.forEach((card) => {
        printCards(card.rank, card.suit, "dealer");
    })
}

function newGame() {
    document.getElementById("new-game-button").disabled = true;
    document.getElementById("hit-button").disabled = false;
    document.getElementById("stand-button").disabled = false;
    document.getElementById("bet").disabled = true;
    document.getElementById("text-message").innerHTML = "";
    hit();
    hit();
    dealerDraw();
    gameOver();
}

function hit() {
    player.cards.push(deck.deckArray[numCardsPulled]);
    player.score = getCardsValue(player.cards);
    document.getElementById("player-score").innerHTML = "Player Score: " + player.score;
    document.getElementById("player-picture").innerHTML = "";
    player.cards.forEach((card) => {
        printCards(card.rank, card.suit, "player");
    })
    numCardsPulled += 1;
    if (numCardsPulled >= 2) {
        gameOver();
    }
}

function stand() {
    while (dealer.score < 17) {
        dealerDraw();
    }
    gameOver();
}

let cardsImages = ["2C.png", "3C.png", "4C.png","5C.png","6C.png","7C.png","8C.png","9C.png","10C.png","JC.png", "QC.png", "KC.png", "AC.png", "2D.png", "3D.png", "4D.png","5D.png","6D.png","7D.png","8D.png","9D.png","10D.png","JD.png", "QD.png", "KD.png", "AD.png", "2H.png", "3H.png", "4H.png","5H.png","6H.png","7H.png","8H.png","9H.png","10H.png","JH.png", "QH.png", "KH.png", "AH.png", "2S.png", "3S.png", "4S.png","5S.png","6S.png","7S.png","8S.png","9S.png","10S.png","JS.png", "QS.png", "KS.png", "AS.png",];

let image = '<img class="cardpicture" src="carddeck/'+cardsImages[51]+'">';

