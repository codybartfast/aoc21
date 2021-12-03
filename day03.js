'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day03.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let lines = input.trim().split(/\r?\n/);
    let data = lines;
    cl(binaryDiagnostic1(data));
    cl(binaryDiagnostic2(data));
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
    let gamma = gammaRate(data.length, posCounts);
    let epsilon = epsilonRate(data.length, posCounts);
    return gamma * epsilon;
}

function gammaRate(numCount, posCounts) {
    return rate1(numCount, posCounts, false);
}

function epsilonRate(numCount, posCounts) {
    return rate1(numCount, posCounts, true);
}

function rate1(numCount, posCounts, epsilon) {
    if (epsilon) {
        posCounts = posCounts.map(c => numCount - c);
    }
    const threshold = numCount / 2;
    const binDigits = posCounts.map(c => c > threshold ? "1" : "0");
    const binString = binDigits.join('');
    const rate = parseInt(binString, 2);
    return rate;
}

function binaryDiagnostic2(data) {
    const o2 = oxygenGeneratorRating(data);
    const co2 = co2ScrubberRating(data);
    return o2 * co2;
}

function oxygenGeneratorRating(data) {
    return rating2(data, 0, false);
}

function co2ScrubberRating(data) {
    return rating2(data, 0, true);
}

function rating2(data, i, pickFewer) {
    let size = data.length;
    if (size === 0) {
        throw new Error('No data!');
    }
    else if (size === 1) {
        return parseInt(data[0], 2);
    }

    const zeros = [];
    const ones = [];
    data.forEach(num => {
        const b = num[i];
        if (b === "0") {
            zeros.push(num);
        } else if (b === "1") {
            ones.push(num);
        } else {
            throw new Error(
                `Unexpected character at position ${i} in ${num}: ${b}`);
        }
    });

    let nextNums =
        ones.length >= zeros.length ?
            (pickFewer ? zeros : ones) :
            (pickFewer ? ones : zeros);

    return rating2(nextNums, i + 1, pickFewer);
}
