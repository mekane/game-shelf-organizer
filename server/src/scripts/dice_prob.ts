// npx tsx ./dice_prod.ts

const diceSize = 8;

function outputProbabilities(
  numSuccesses: number,
  numDice: number,
  rollsWithAtLeastOneSuccessOf: number[],
  totalRolls: number,
) {
  console.log('');
  for (let difficulty = 3; difficulty <= 6; difficulty++) {
    console.log(
      `Chance of at least ${numSuccesses} ${difficulty}+ success with ${numDice} dice: ${
        rollsWithAtLeastOneSuccessOf[difficulty]
      }/${totalRolls} = ${(
        (rollsWithAtLeastOneSuccessOf[difficulty] / totalRolls) *
        100
      ).toFixed(1)}`,
    );
  }
}

function oneDie() {
  // generate rolls
  const rollsOneDie: number[][] = [];
  for (let i = 1; i <= diceSize; i++) {
    rollsOneDie.push([i]);
  }

  console.log('');
  console.log('One Die');
  const totalRolls = rollsOneDie.length;
  const rollsWithSuccess: number[] = [];

  // count rolls with successes
  for (let i = 0; i <= 8; i++) {
    rollsWithSuccess[i] = rollsOneDie.filter((r) =>
      r.some((v) => v >= i),
    ).length;
  }

  outputProbabilities(1, 1, rollsWithSuccess, totalRolls);
}

function twoDice() {
  const rollsTwoDice: number[][] = [];
  for (let i = 1; i <= diceSize; i++) {
    for (let j = 1; j <= diceSize + 4; j++) {
      rollsTwoDice.push([i, j]);
    }
  }

  console.log('');
  console.log('Two Dice');
  //console.log("Two Dice:", rollsTwoDice);
  const totalRolls2 = rollsTwoDice.length;
  const rollsWithSuccess2: number[] = [];

  // count rolls with at least one success
  for (let i = 0; i <= 8; i++) {
    rollsWithSuccess2[i] = rollsTwoDice.filter((r) =>
      r.some((v) => v >= i),
    ).length;
  }
  // outputProbabilities(1, 2, rollsWithSuccess2, totalRolls2);

  // count rolls with two successes
  for (let i = 0; i <= 8; i++) {
    rollsWithSuccess2[i] = rollsTwoDice.filter((r) =>
      r.every((v) => v >= i),
    ).length;
  }
  outputProbabilities(2, 2, rollsWithSuccess2, totalRolls2);
}

function threeDice() {
  // THREE DICE
  const rollsThreeDice: number[][] = [];
  for (let i = 1; i <= diceSize; i++) {
    for (let j = 1; j <= diceSize; j++) {
      for (let k = 1; k <= diceSize; k++) {
        rollsThreeDice.push([i, j, k]);
      }
    }
  }

  console.log('');
  console.log('Three Dice');
  const totalRolls3 = rollsThreeDice.length;
  const rollsWithSuccess3: number[] = [];

  // count rolls with at least one success
  for (let i = 0; i <= 8; i++) {
    rollsWithSuccess3[i] = rollsThreeDice.filter((r) =>
      r.some((v) => v >= i),
    ).length;
  }
  outputProbabilities(1, 3, rollsWithSuccess3, totalRolls3);

  // count rolls with at least two successes
  for (let i = 0; i <= 8; i++) {
    rollsWithSuccess3[i] = rollsThreeDice.filter((r) => {
      const successesInRoll = r.filter((v) => v >= i).length;

      //console.log(`Check ${r} for (${i}+): found ${successesInRoll} successes`)

      return successesInRoll >= 2;
    }).length;
  }
  outputProbabilities(2, 3, rollsWithSuccess3, totalRolls3);

  // count rolls with at least three successes
  for (let i = 0; i <= 8; i++) {
    rollsWithSuccess3[i] = rollsThreeDice.filter((r) => {
      const successesInRoll = r.filter((v) => v >= i).length;

      //console.log(`Check ${r} for (${i}+): found ${successesInRoll} successes`)

      return successesInRoll >= 3;
    }).length;
  }
  outputProbabilities(3, 3, rollsWithSuccess3, totalRolls3);
}

function fourDice() {
  // FOUR DICE
  const rollsFourDice: number[][] = [];
  for (let i = 1; i <= diceSize; i++) {
    for (let j = 1; j <= diceSize; j++) {
      for (let k = 1; k <= diceSize; k++) {
        for (let m = 1; m <= diceSize; m++) {
          rollsFourDice.push([i, j, k, m]);
        }
      }
    }
  }

  console.log('');
  console.log('Four Dice');
  const totalRolls4 = rollsFourDice.length;
  const rollsWithSuccesses: number[] = [];

  // count rolls with at least one success
  for (let i = 0; i <= 8; i++) {
    rollsWithSuccesses[i] = rollsFourDice.filter((r) =>
      r.some((v) => v >= i),
    ).length;
  }
  outputProbabilities(1, 4, rollsWithSuccesses, totalRolls4);

  // count rolls with at least two successes
  for (let i = 0; i <= 8; i++) {
    rollsWithSuccesses[i] = rollsFourDice.filter((r) => {
      const successesInRoll = r.filter((v) => v >= i).length;

      //console.log(`Check ${r} for (${i}+): found ${successesInRoll} successes`)

      return successesInRoll >= 2;
    }).length;
  }
  outputProbabilities(2, 4, rollsWithSuccesses, totalRolls4);

  // count rolls with at least three successes
  for (let i = 0; i <= 8; i++) {
    rollsWithSuccesses[i] = rollsFourDice.filter((r) => {
      const successesInRoll = r.filter((v) => v >= i).length;

      //console.log(`Check ${r} for (${i}+): found ${successesInRoll} successes`)

      return successesInRoll >= 3;
    }).length;
  }
  outputProbabilities(3, 4, rollsWithSuccesses, totalRolls4);

  // count rolls with at least three successes
  for (let i = 0; i <= 8; i++) {
    rollsWithSuccesses[i] = rollsFourDice.filter((r) => {
      const successesInRoll = r.filter((v) => v >= i).length;

      //console.log(`Check ${r} for (${i}+): found ${successesInRoll} successes`)

      return successesInRoll >= 4;
    }).length;
  }
  //outputProbabilities(4, 4, rollsWithSuccesses, totalRolls4);
}

function main() {
  //oneDie();
  twoDice();
  // threeDice();
  // fourDice();
}

main();
