const fs = require('fs');
const { program } = require('commander');

// Define the command line options
program
  .option('-i, --in <inputFile>', 'Input file path')
  .option('-o, --out <outputFile>', 'Output file path')
  .parse(process.argv);

// Read the input file
let inputData;
try {
  inputData = fs.readFileSync(program.opts().in, 'utf8');
} catch (err) {
  console.error(`Error reading input file: ${err}`);
  process.exit(1);
}

// Parse the input data into a more usable format
const pointsBySymbol = {
  j: 11,
  q: 12,
  k: 13,
  a: 11
};
const pointsBySuits = { d: 1, h: 2, s: 3, c: 4 }
const hands = inputData.trim().split('\n').map(line => {
  const [name, ...cards] = line.toLowerCase().replace(/\s/g, '').split(':');
  return {
    name,
    cards: cards.map(card => {
      let value = 0;
      const currentSuite = card.charAt(card.length - 1);
      const currentValue = card.replace(currentSuite, '');

      if(isNaN(currentValue)){
        value = currentValue;
      }else{
        value = pointsBySymbol[currentValue.toLowerCase()];
      }

      const suit = pointsBySuits[currentSuite.toLowerCase()];

      return { value, suit };
    })
  };
});

console.log(hands)


// Calculate each player's score
const scores = hands.map(hand => {
  const sortedCards = hand.cards.sort((a, b) => b.value - a.value);
  const baseScore = sortedCards.slice(0, 3).reduce((total, card) => total + card.value, 0);
  const suitScore = sortedCards[0].suit;
  return { name: hand.name, baseScore, suitScore };
});


console.log(scores)
// Determine the winner(s)
const maxScore = Math.max(...scores.map(score => score.baseScore));
const winners = scores.filter(score => score.baseScore === maxScore);

if (winners.length === 1) {
  // There's a clear winner
  const winner = winners[0];
  const outputData = `${winner.name}:${winner.baseScore + winner.suitScore}`;
  fs.writeFileSync(program.opts().out, outputData, 'utf8');
  console.log(outputData)
} else {
  // There's a tie, so we need to calculate suit scores
  const suitScores = winners.map(score => ({ name: score.name, suitScore: score.suitScore }));
  const maxSuitScore = Math.max(...suitScores.map(score => score.suitScore));
  const suitWinners = suitScores.filter(score => score.suitScore === maxSuitScore);
  console.log(suitWinners);
  const outputData = `${suitWinners.map(score => score.name).join(',')}:${maxScore + maxSuitScore}`;
  console.log(outputData);
  fs.writeFileSync(program.opts().out, outputData, 'utf8');
}

function calculateScore(hand) {
  let cards = hand.split(",");
  let baseScore = 0;
  let suitScore = 0;

  cards.forEach((card) => {
    let value = card.slice(0, -1);
    

    if (value === "J") {
      value = 11;
    } else if (value === "Q") {
      value = 12;
    } else if (value === "K") {
      value = 13;
    } else if (value === "A") {
      value = 11;
    } else {
      value = parseInt(value);
    }

    if (value < 10) {
      baseScore += value;
    } else {
      baseScore += 10;
    }

    if (suit === "D") {
      suitScore = Math.max(suitScore, 1);
    } else if (suit === "H") {
      suitScore = Math.max(suitScore, 2);
    } else if (suit === "S") {
      suitScore = Math.max(suitScore, 3);
    } else if (suit === "C") {
      suitScore = Math.max(suitScore, 4);
    }
  });

  return { baseScore: baseScore, suitScore: suitScore };
}