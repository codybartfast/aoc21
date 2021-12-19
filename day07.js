'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day07.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let crabs = input.trim().split(',').map(Number);
    cl(theTreacheryOfWhales(crabs));
});

function theTreacheryOfWhales(crabs) {
    let min = Infinity;
    for(let i = 0; i < crabs.length; i++){
        let f = fuel(crabs, i);
        min = Math.min(min, f);
    }
    return min
}

function fuel(crabs, x){
    return crabs
        .map(crab => crab - x)
        .reduce((a, b) => a + Math.abs(b));
}

