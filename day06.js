'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day06.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let fish = input.trim().split(',').map(Number);
    cl(lanternfish(fish, 80));
    cl(lanternfish(fish, 256));
});

function lanternfish(fish, days) {
    let shoal = new Array(9).fill(0);
    fish.forEach(f => shoal[f]++)
    for (let i = 0; i < days; i++) {
        day(shoal);
    }
    return shoal.reduce((a, b) => a + b);
}

function day(shoal) {
    let spawning = shoal.shift();
    shoal[6] += spawning;
    shoal[8] = spawning;
}
