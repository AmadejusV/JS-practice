const startGameBtn = document.getElementById('start-game-btn');

const rock = "Rock";
const paper = "Paper";
const scissors = "Scissors";
const RESULT_DRAW = "DRAW";
const RESULT_PLAYER_WINS = "PLAYER_WINS";
const RESULT_COMPUTER_WINS = "COMPUTER_WINS";

let gameIsRunning = false;

const getPlayerChoice = function(){
    let selection = selectionInput();
    let iteration = 0;

    //validating and asking for correct input before disassembling users notion of free will
    while (selection!=rock && selection!=paper && selection!=scissors) {
        //grammar nazi evasion maneuver
        let isPlural=iteration<1?"tries":"try";

        //setting default selection for the ones with analysis paralysis
        if(iteration>=2){
            selection="Rock";
            alert("Set selection to default value 'Rock' after 3 tries");
        }else{
            iteration++;
            alert(`Wrong input, please choose between: rock, paper and scissors and type it in. You've got ${3-iteration} more ${isPlural}.`);
            selection = selectionInput();
        }
    }
    return selection;
}

const selectionInput = function(){
    //get input, convert to lower case
    let selection = prompt("Rock, paper or scissors?","").toLowerCase();
    //convert first letter of input to upper case
    const capitalizedSelection = selection.charAt(0).toUpperCase()+selection.slice(1);
    return capitalizedSelection;
}

const getComputerChoice = function () {
  //get random number from 1 to 3
  const randomNumber = Math.floor(Math.random() * 3) + 1;
  let computerChoice = "";
    
  switch (randomNumber) {
    case 1:
      return computerChoice = rock;
    case 2:
      return computerChoice = paper;
    case 3:
      return computerChoice = scissors;
    default:
      alert(`Something went wrong, randomNumber value = ${randomNumber}`);
      break;
  }
};

const getWinner = function (playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return RESULT_DRAW;
  } else if (
    (computerChoice === rock && playerChoice === paper) ||
    (computerChoice === paper && playerChoice === scissors) ||
    (computerChoice === scissors && playerChoice === rock)
  ) {
    return RESULT_PLAYER_WINS;
  } else {
    return RESULT_COMPUTER_WINS;
  }
};

startGameBtn.addEventListener('click', function(){
    //prevent running multiple games
    if(gameIsRunning){
        return;
    }
    gameIsRunning=true;
    console.log("Game is starting...");
    const playerSelection = getPlayerChoice();
    const computerSelection = getComputerChoice();
    const winner = getWinner(playerSelection, computerSelection);
    alert(`${winner}\n player chose ${playerSelection}\n computer chose ${computerSelection}`);
    gameIsRunning=false;
});