'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day11.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let cavern = input.trim().split(/\r?\n/).map(ln => [...ln].map(Number));
    cavern.width = cavern[0].length;
    cavern.height = cavern.length;
    dumboOctopus(cavern);
});

function dumboOctopus(cavern) {
    let flashes, flashTotal = 0;
    for (let step = 1; ; step++) {
        flashTotal += (flashes = takeStep(cavern));
        if (step === 100) {
            cl(flashTotal);
        }
        if (flashes === 100) {
            cl(step)
            break
        };
    }
}

function takeStep(cv) {
    let flashes, flashTotal = 0;
    incrementAll(cv);
    while ((flashes = naiveFlash(cv)) > 0) {
        flashTotal += flashes;
    }
    return flashTotal;
}

function naiveFlash(cv) {
    let flashers = allOctopodes(cv).filter(oct => get(cv, oct) > 9);
    flashers
        .map(oct => adjacentOct(cv, oct)).flat()
        .filter(oct => get(cv, oct) > 0)
        .forEach(oct => increment(cv, oct));
    flashers.forEach(oct => set(cv, oct, 0));
    return flashers.length;
}

function incrementAll(cv) {
    allOctopodes(cv).forEach(oct => increment(cv, oct));
}

function increment(cv, oct) {
    set(cv, oct, get(cv, oct) + 1);
}

function get(cv, oct) {
    return cv[oct.y][oct.x];
}

function set(cv, oct, val) {
    cv[oct.y][oct.x] = val;
}

function allOctopodes(cv) {
    let octopodes = []
    for (let x = 0; x < cv.width; x++) {
        for (let y = 0; y < cv.height; y++) {
            octopodes.push({ x, y });
        }
    }
    return octopodes;
}

function adjacentOct(cv, coord) {
    let { x: x, y: y } = coord;
    let adjacent = [];
    if (y - 1 >= 0) { adjacent.push({ x, y: y - 1 }) };
    if (y - 1 >= 0 && x + 1 < cv.width) {
        adjacent.push({ x: x + 1, y: y - 1 })
    };
    if (x + 1 < cv.width) { adjacent.push({ x: x + 1, y }) };
    if (x + 1 < cv.width && y + 1 < cv.height) {
        adjacent.push({ x: x + 1, y: y + 1 })
    };
    if (y + 1 < cv.height) { adjacent.push({ x, y: y + 1 }) };
    if (y + 1 < cv.height && x - 1 >= 0) {
        adjacent.push({ x: x - 1, y: y + 1 })
    };
    if (x - 1 >= 0) { adjacent.push({ x: x - 1, y }) };
    if (x - 1 >= 0 && y - 1 >= 0) {
        adjacent.push({ x: x - 1, y: y - 1 })
    };
    return adjacent;
}
