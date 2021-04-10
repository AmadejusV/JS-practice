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

let userInputHP = askForInputHP();

let chosenMaxLife = parseInt(userInputHP);
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealthAfterHit, playerHpAfterAttack) {
  let newLogEntry;

  if ((event === LOG_EVENT_PLAYER_ATTACK)) {
    newLogEntry = {
      event: event,
      attackValue: value,
      target: "MONSTER",
      monsterHPAfterAttack: monsterHealthAfterHit,
      playerHealthAfterEncounter: playerHpAfterAttack,
    };
  } else if ((event === LOG_EVENT_MONSTER_ATTACK)) {
    newLogEntry = {
      event: event,
      attackValue: value,
      target: "PLAYER",
      monsterHPAfterAttack: monsterHealthAfterHit,
      playerHealthAfterEncounter: playerHpAfterAttack,
    };
  } else if ((event === LOG_EVENT_PLAYER_STRONG_ATTACK)) {
    newLogEntry = {
      event: event,
      attackValue: value,
      target: "MONSTER",
      monsterHPAfterAttack: monsterHealthAfterHit,
      playerHealthAfterEncounter: playerHpAfterAttack,
    };
  } else if ((event === LOG_EVENT_GAME_OVER)) {
    newLogEntry = {
      event: event,
      attackValue: value,
      monsterHPAfterAttack: monsterHealthAfterHit,
      playerHealthAfterEncounter: playerHpAfterAttack,
    };
  } else if ((event === LOG_EVENT_PLAYER_HEAL)) {
    newLogEntry = {
      event: event,
      attackValue: value,
      target: "PLAYER",
      monsterHPAfterAttack: monsterHealthAfterHit,
      playerHealthAfterEncounter: playerHpAfterAttack,
    };
  }

  battleLog.push(newLogEntry);
}

function askForInputHP() {
  let userInputHP = prompt(
    "Please enter a number for your and monster's max HP value:",
    "100"
  );

  if (isNaN(userInputHP) || userInputHP <= 0) {
    userInputHP = 100;
    console.log(userInputHP);
  }
  return userInputHP;
}

function reset() {
  chosenMaxLife = askForInputHP();
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
  let maxDamage = 0;
  let eventAttackType;

  if (attackValue === MODE_ATTACK) {
    maxDamage = ATTACK_VALUE;
    eventAttackType = LOG_EVENT_PLAYER_ATTACK;
  } else if (attackValue === MODE_STRONG_ATTACK) {
    maxDamage = STRONG_ATTACK_VALUE;
    eventAttackType = LOG_EVENT_PLAYER_STRONG_ATTACK;
  }

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(
    eventAttackType,
    damage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();

  //mano----------------------------------
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
  //mano--------------
  // attackMonster(ATTACK_VALUE);
}

function strongAttackHandler() {
  attackMonster(MODE_STRONG_ATTACK);
  //mano--------------
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
  console.log(battleLog);
}

logBtn.addEventListener("click", consoleLogBattleLog);
healBtn.addEventListener("click", healHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
attackBtn.addEventListener("click", attackMonsterHandler);
