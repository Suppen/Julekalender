import { readFileSync } from 'fs';

function parseInput(text) {
    const lines = text.trim().split('\n');
    const capacity = parseInt(lines[0]);
    const gifts = lines.slice(1).map(line => {
        const [name, weight, happiness] = line.split(',');
        return {
            name,
            weight: parseInt(weight),
            happiness: parseInt(happiness)
        };
    });
    return { capacity, gifts };
}

function solveKnapsack(capacity, gifts) {
    const n = gifts.length;

    // Create DP table: dp[i][w] = max happiness with first i items and capacity w
    const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));

    // Fill the DP table
    for (let i = 1; i <= n; i++) {
        const gift = gifts[i - 1];
        for (let w = 0; w <= capacity; w++) {
            // Don't take the gift
            dp[i][w] = dp[i - 1][w];

            // Take the gift if it fits
            if (gift.weight <= w) {
                const takeGift = dp[i - 1][w - gift.weight] + gift.happiness;
                dp[i][w] = Math.max(dp[i][w], takeGift);
            }
        }
    }

    // Backtrack to find which gifts were selected
    const selectedGifts = [];
    let w = capacity;
    for (let i = n; i > 0; i--) {
        if (dp[i][w] !== dp[i - 1][w]) {
            selectedGifts.push(gifts[i - 1]);
            w -= gifts[i - 1].weight;
        }
    }

    const totalHappiness = dp[n][capacity];
    const totalWeight = selectedGifts.reduce((sum, g) => sum + g.weight, 0);

    return {
        totalHappiness,
        totalWeight,
        selectedGifts: selectedGifts.reverse()
    };
}

// Main
const input = readFileSync('input.txt', 'utf-8');
const { capacity, gifts } = parseInput(input);

console.log(`Kapasitet: ${capacity}`);
console.log(`Antall gaver: ${gifts.length}\n`);

const result = solveKnapsack(capacity, gifts);

console.log(`Maksimal glede: ${result.totalHappiness}`);
console.log(`Total vekt: ${result.totalWeight}`);
console.log(`Antall gaver valgt: ${result.selectedGifts.length}\n`);

console.log('Valgte gaver:');
result.selectedGifts.forEach(gift => {
    console.log(`  ${gift.name}: vekt=${gift.weight}, glede=${gift.happiness}`);
});
