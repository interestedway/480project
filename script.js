/*
Stores game status element to allow us to more easily 
use it later on 
*/
const statusDisplay = document.querySelector('.game--status');

/*
--Changes color of text based off of url parameters, vulnerable due to dom !important overrides CSS
--Source of function https://learn.snyk.io/lesson/dom-based-xss/   
*/

function changeTextColor(){
    var pos = document.URL.indexOf('color=') + 6;
    document.write(
        '<style>body{color:' +
            document.URL.substring(pos, document.URL.length) +
            '!important;}</style>'
    );
}

changeTextColor();

/*
Leakable fake api key that can be leaked through an error message
*/
const aKey = 446853;
let apiError = `API key is correct ${aKey}`;

function apiCheck(){
    throw new Error(apiError)
}


/*
We will use gameActive to pause the game if the game is ended
*/
let gameActive = true;

/*
Stores current player starting with player X 
*/
let currentPlayer = "X";

/*
We will store our current game state here, the form of empty strings in an array
 will allow us to easily track played cells and validate the game state later on
*/
let gameState = ["", "", "", "", "", "", "", "", ""];

/*
Here we have declared some messages we will display to the user during the game.
Since we have some dynamic factors in those messages, namely the current player,
we have declared them as functions, so that the actual message gets created with 
current data every time we need it.
*/
const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

/*
We set the inital message to let the players know whose turn it is
*/

statusDisplay.innerHTML = currentPlayerTurn();
function handleCellPlayed(clickedCell, clickedCellIndex) {
    /*
    Update our internal game state to reflect the played move, 
    as well as update the user interface to reflect the played move
    */
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;

    if ( currentPlayer == "X" ) { 
        document.querySelectorAll('.cell')[clickedCellIndex].style.color = "blue";
    }else{
        document.querySelectorAll('.cell')[clickedCellIndex].style.color = "red";
    }
}

//change current player and update game state message using ternary operator
function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

//Winning combinations
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

//Logic for winnningConditions
function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break
        }
    }
if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        return;
    }

/* 
We will check if there are any values in our game state array 
that are still not populated with a player sign
*/
    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        return;
    }
    
/*
If we get to here we know that the no one won the game yet, 
and that there are still moves to be played, so we continue by changing the current player.
*/
    handlePlayerChange();
}

function handleCellClick(clickedCellEvent) {

    /*
    We will save the clicked html element in a variable for easier further use
    */    
    const clickedCell = clickedCellEvent.target;

    /*
    Grab the 'data-cell-index' attribute from clicked cell to identify where that cell is in our grid. 
    getAttribute will return a string value.  Will parse it to an 
    integer(number)
    */
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    /* 
    Next up we need to check whether the call has already been played, 
    or if the game is paused. If either of those is true we will simply ignore the click.
    */
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    /* 
    If everything in order we will proceed 
    */    
    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}


//Resets game tracking variables 
function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell')
               .forEach(cell => cell.innerHTML = "");
}

/*
Event listeners for the game cells and 
restart button
*/
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);

//Array to hold inputText
let matchHistory = [];

/*
--Added to retrieve value of inputText textbox, send to array, keep last three results, assign to innerHTML and then sends results to the html userInput through DOM
*/
function textPrint() {
    let userInput = document.getElementById("inputText").value;

    matchHistory.push(userInput);
    if(matchHistory.length > 3){
        matchHistory.shift();
    }

    document.getElementById("userInput").innerHTML = matchHistory.join("\r\n");
}

/*
--Stores "token" in local storage, can be seen through dev tools in application tab
*/
function tokenStorage(){
    localStorage.setItem('loginToken', '733TKEY');
}

