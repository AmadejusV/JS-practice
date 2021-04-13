const startGameBtn = document.getElementById("start-game-btn");

const rock = "Rock";
const paper = "Paper";
const scissors = "Scissors";
const RESULT_DRAW = "DRAW";
const RESULT_PLAYER_WINS = "PLAYER_WINS";
const RESULT_COMPUTER_WINS = "COMPUTER_WINS";

let gameIsRunning = false;

const getPlayerChoice = () => {
  let selection = selectionInput();
  let iteration = 0;

  //validating and asking for correct input before disassembling users notion of free will
  while (selection != rock && selection != paper && selection != scissors) {
    //grammar nazi evasion maneuver
    let isPlural = iteration < 1 ? "tries" : "try";

    //setting default selection for the ones with analysis paralysis
    if (iteration >= 2) {
      selection = "Rock";
      alert("Set selection to default value 'Rock' after 3 tries");
    } else {
      iteration++;
      alert(
        `Wrong input, please choose between: rock, paper and scissors and type it in. You've got ${
          3 - iteration
        } more ${isPlural}.`
      );
      selection = selectionInput();
    }
  }
  return selection;
};

const selectionInput = () => {
  let selection="";
  let cancelIteration=0;
  while (!selection) {
    if (cancelIteration>=3) {
      alert("Canceled 3 times, rather than playing, breaking operation. \n Refresh page to try again.");
      break;
    }
    //get input, convert to lower case
    selection = prompt("Rock, paper or scissors?", "");
    cancelIteration++;
  }
  //convert first letter of input to upper case
  selection = selection.toLowerCase();
  const capitalizedSelection = selection.charAt(0).toUpperCase() + selection.slice(1);

  return capitalizedSelection;
};

const getComputerChoice = () => {
  //get random number from 1 to 3
  const randomNumber = Math.floor(Math.random() * 3) + 1;
  let computerChoice = "";

  switch (randomNumber) {
    case 1:
      return (computerChoice = rock);
    case 2:
      return (computerChoice = paper);
    case 3:
      return (computerChoice = scissors);
    default:
      alert(`Something went wrong, randomNumber value = ${randomNumber}`);
      break;
  }
};

const getWinner = (playerChoice, computerChoice) => {
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

startGameBtn.addEventListener("click", () => {
  //prevent running multiple games
  if (gameIsRunning) {
    return;
  }
  gameIsRunning = true;
  console.log("Game is starting...");
  const playerSelection = getPlayerChoice();
  const computerSelection = getComputerChoice();
  const winner = getWinner(playerSelection, computerSelection);

  //playing with ternary operator
  let outcomeString =
    winner === RESULT_DRAW
      ? "it's a draw..."
      : winner===RESULT_PLAYER_WINS
      ? "you won!"
      : "you lost.";
  let additionalWord = winner === RESULT_DRAW ? "also " : "";
  alert(
    `You chose ${playerSelection} and the computer ${additionalWord}chose ${computerSelection} therefore ${outcomeString}`
  );
  gameIsRunning = false;
});

//not related

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9,"a"];

const sumUpArray = (numberArray) => {
  //functions inside functions work, questionable usage in practice (can't be used out of scope. good for abstraction?)
  const validateNumber = (number) => {
    return isNaN(number)?0:number;
  }

  let sum = 0;
  for (const number of numberArray) {
    sum += validateNumber(number);
  }
  return sum;
};

console.log(sumUpArray(numbers));

const showResult = (messageText, result)=>{
  console.log(`${messageText} ${result}`);
}

//rest operator permits usage of more than set amount of parameters in the function
const sumUp = (callbackFunction, ...numbers) => {
  let sum = 0;
  for (const number of numbers) {
    sum += number;
  }
  callbackFunction(sum);
  return sum;
};
//using a callback function, bind lets you insert an argument to showResult function, that argument would go first in line
//before the arguments that were given where this callback function was first called
console.log(sumUp(showResult.bind(this, "The sum is"),1,2,3,4,5,6,7,8,9));


//using ancient magic to achieve similar functionality to ...restOperator
//arguments get's what you pass inside the function after declaring it without parameters?...
const subtractArray = function(){
  let subtractionOutcome = 0;
  for (const number of arguments) {
    subtractionOutcome -= number;
  }
  return subtractionOutcome;
}

console.log(subtractArray(1,2,3,4,5,6,7,8,9));

