const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;
const MODE_ATTACK = "ATTACK"; // MODE_ATTACK = 0
const MODE_STRONG_ATTACK = "STRONG_ATTACK"; // STRONG_ATTACK = 1
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_GAME_OVER = "GAME_OVER";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";

let userInputHP;

function inputHpWithTryCatch(){
  try {
    userInputHP = askForInputHP();
  } catch (error) {
    console.log(error);
    console.log("Setting value to a default value of 100");
    userInputHP=100;
  }
  let parsedOutput = parseInt(userInputHP);
  return parsedOutput;
}

let chosenMaxLife = inputHpWithTryCatch();

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];


function askForInputHP() {
  let userInput = prompt(
    "Please enter a number for your and monster's max HP value:",
    "100"
  );
    userInput = parseInt(userInput);
  if (isNaN(userInput) || userInput <= 0) {
    //trying out throwing errors
    throw {error: `${userInput} is not a valid number.`};
    // userInputHP = 100;
  }
  return userInput;
}

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealthAfterHit, playerHpAfterAttack) {
  let newLogEntry = {
    event: event,
    attackValue: value,
    monsterHPAfterAttack: monsterHealthAfterHit,
    playerHealthAfterEncounter: playerHpAfterAttack,
  };

  switch (event) {
    case LOG_EVENT_PLAYER_ATTACK:
      newLogEntry.target = "MONSTER";
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      newLogEntry.target = "PLAYER";
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      newLogEntry.target = "MONSTER";
      break;
    case LOG_EVENT_GAME_OVER:
      newLogEntry.target = "MONSTER";
      break;
    case LOG_EVENT_PLAYER_HEAL:
      newLogEntry.target = "PLAYER";
      break;
    default:
      newLogEntry = {noValue: null}
      break;
  }

  // if (event === LOG_EVENT_PLAYER_ATTACK) {
  //   newLogEntry = {
  //     event: event,
  //     attackValue: value,
  //     target: "MONSTER",
  //     monsterHPAfterAttack: monsterHealthAfterHit,
  //     playerHealthAfterEncounter: playerHpAfterAttack,
  //   };
  // } else if (event === LOG_EVENT_MONSTER_ATTACK) {
  //   newLogEntry = {
  //     event: event,
  //     attackValue: value,
  //     target: "PLAYER",
  //     monsterHPAfterAttack: monsterHealthAfterHit,
  //     playerHealthAfterEncounter: playerHpAfterAttack,
  //   };
  // } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
  //   newLogEntry = {
  //     event: event,
  //     attackValue: value,
  //     target: "MONSTER",
  //     monsterHPAfterAttack: monsterHealthAfterHit,
  //     playerHealthAfterEncounter: playerHpAfterAttack,
  //   };
  // } else if (event === LOG_EVENT_GAME_OVER) {
  //   newLogEntry = {
  //     event: event,
  //     attackValue: value,
  //     monsterHPAfterAttack: monsterHealthAfterHit,
  //     playerHealthAfterEncounter: playerHpAfterAttack,
  //   };
  // } else if (event === LOG_EVENT_PLAYER_HEAL) {
  //   newLogEntry = {
  //     event: event,
  //     attackValue: value,
  //     target: "PLAYER",
  //     monsterHPAfterAttack: monsterHealthAfterHit,
  //     playerHealthAfterEncounter: playerHpAfterAttack,
  //   };
  // }

  battleLog.push(newLogEntry);
}



function reset() {
  chosenMaxLife = inputHpWithTryCatch();
  currentPlayerHealth = chosenMaxLife;
  currentMonsterHealth = chosenMaxLife;
  adjustHealthBars(chosenMaxLife);
  hasBonusLife = true;
  bonusLifeEl.style.display = "unset";
  resetGame(chosenMaxLife);
}

function endRound() {
  const damageToPlayer = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  const initialPlayerHealth = currentPlayerHealth;
  currentPlayerHealth -= damageToPlayer;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    damageToPlayer,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(currentPlayerHealth);
    alert("You would be dead if not for your extra life.");
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("You have won!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("The monster has won!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert("Both lost");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "ONLY LOSS HERE",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMonster(attackValue) {
  //using ternary operator instead of if/else statement, possible nesting while the logic doesn't get too long,
  // else if/else is a better choice
  let maxDamage =
    attackValue === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  let eventAttackType =
    attackValue === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;

  // if (attackValue === MODE_ATTACK) {
  //   maxDamage = ATTACK_VALUE;
  //   eventAttackType = LOG_EVENT_PLAYER_ATTACK;
  // } else if (attackValue === MODE_STRONG_ATTACK) {
  //   maxDamage = STRONG_ATTACK_VALUE;
  //   eventAttackType = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(
    eventAttackType,
    damage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();

  //mine----------------------------------
  // const damage = dealMonsterDamage(attackValue);
  // currentMonsterHealth -= damage;

  // const damageToPlayer = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  // currentPlayerHealth -= damageToPlayer;

  // if(currentMonsterHealth<=0 && currentPlayerHealth>0){
  //     alert("You have won!");

  // }else if(currentPlayerHealth<=0 && currentMonsterHealth>0){
  //     alert("The monster has won!");
  // }else if(currentPlayerHealth<=0 && currentMonsterHealth<=0){
  //     alert("Both lost");
  // }
}

function attackMonsterHandler() {
  attackMonster(MODE_ATTACK);
  //mine--------------
  // attackMonster(ATTACK_VALUE);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
  //mine--------------
  // attackMonster(STRONG_ATTACK_VALUE);
}

function healHandler() {
  if (currentPlayerHealth > 0) {
    let trueHealValue = 0;

    if (currentPlayerHealth + HEAL_VALUE >= chosenMaxLife) {
      trueHealValue = chosenMaxLife - currentPlayerHealth;
      alert("You can't heal over your maximum health...");
    } else {
      trueHealValue = HEAL_VALUE;
    }

    // HEAL_VALUE = trueHealValue;
    increasePlayerHealth(trueHealValue);
    currentPlayerHealth += trueHealValue;
    writeToLog(
      LOG_EVENT_PLAYER_HEAL,
      trueHealValue,
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0) {
    alert("Sorry he dead...");
  }
  endRound();
}

function consoleLogBattleLog() {
  //usual iteration
  // for(let i = 0; i<battleLog.length; i++){
  //   console.log(battleLog[i]);
  // }

  // (Loops through arrays) same result, no incrementation and access to elements index without setting one manually
  let index=0;
  for(const element of battleLog){
    console.log(`#${index}`);
    index++;
    //(Loops through objects)
    for (const key in element) {
      //print every objects key and it's value found by object's key
      console.log(`${key} => ${element[key]}`);
    }
  }

  console.log(battleLog);
}


//-----------------labeled statement and discontinuation with break
outerForLoop: for (let i = 0; i < 10; i++) {
  console.log(`Outer loop, iteration ${i}`);

  innerForLoop: for (let j = 0; j < 10; j++) {
    if (i===2 && j===3) {
      console.log("Breaking outer loop when outer loops reaches-2 and inner-3");
      break outerForLoop;
    }
    console.log(`Inner loop, iteration: ${j}`)
  }
  
}


logBtn.addEventListener("click", consoleLogBattleLog);
healBtn.addEventListener("click", healHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
attackBtn.addEventListener("click", attackMonsterHandler);
