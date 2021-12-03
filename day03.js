'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day03.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let lines = input.trim().split(/\r?\n/);
    let data = lines;
    binaryDiagnostic1(data);
});

function binaryDiagnostic1(data) {
    let size = data[0].length;
    let posCounts = new Array(size).fill(0);
    data.forEach(num => {
        for (let i = 0; i < size; i++) {
            if (num.charAt(i) === "1") {
                posCounts[i] += 1;
            }
        }
    });
    let gamma = rate(data.length, posCounts, false);
    let epsilon = rate(data.length, posCounts, true);
    cl(gamma * epsilon);
}

function rate(numCount, posCounts, epsilon) {
    if (epsilon) {
        posCounts = posCounts.map(c => numCount - c);
    }
    const threshold = numCount / 2 + 1;
    const binDigits = posCounts.map(c => c >= threshold ? "1" : "0");
    const binString = binDigits.join('');
    const rate = parseInt(binString, 2);
    return rate;
}
