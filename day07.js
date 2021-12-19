'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day07.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let crabs = input.trim().split(',').map(Number);
    cl(theTreacheryOfWhales(crabs, false));
    cl(theTreacheryOfWhales(crabs, true));
});

function theTreacheryOfWhales(crabs, useCrabEngineering) {
    let maxPosition = Math.max(...crabs);
    let fTable = fuelTable(maxPosition, useCrabEngineering);
    let min = Infinity;
    for (let horizPos = 0; horizPos <= maxPosition; horizPos++) {
        let fuel = totalFuel(crabs, horizPos, fTable);
        min = Math.min(min, fuel);
    }
    return min;
}

function totalFuel(crabs, horzPos, fuelTable) {
    return crabs
        .map(crab => fuelTable[Math.abs(crab - horzPos)])
        .reduce((a, b) => a + b);
}

function fuelTable(maxDist, useCrabEngineering) {
    let size = maxDist + 1;
    let table = new Array(size);
    table[0] = 0;
    for (let i = 1; i < size; i++) {
        table[i] = useCrabEngineering ? table[i - 1] + i : i;
    }
    return table;
}