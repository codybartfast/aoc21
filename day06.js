'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day06.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let fish = input.trim().split(',').map(Number);
    cl(lanternfish(fish));
});

function lanternfish(fish) {
    let shoal = new Array(9).fill(0);
    fish.forEach(f => shoal[f]++)
    for (let i = 0; i < 80; i++) {
        day(shoal);
    }
    return shoal.reduce((a, b) => a + b);
}

function day(shoal) {
    let spawning = shoal.shift();
    shoal[6] += spawning;
    shoal[8] = spawning;
}
