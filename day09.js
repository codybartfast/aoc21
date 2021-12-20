'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day09.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let lines = input.trim().split(/\r?\n/);
    let cave = lines.map(ln => [...ln].map(Number));
    cave.width = cave[0].length;
    cave.height = cave.length;
    cave.lookup = function (coord) { return this[coord.y][coord.x]; };
    cl(smokeBasin1(cave));
    cl(smokeBasin2(cave));
});

function smokeBasin1(cave) {
    let risk = 0;
    for (let lowPoint of lowPoints(cave)) {
        risk += 1 + cave.lookup(lowPoint);
    }
    return risk;
}

function* lowPoints(cave) {
    let risk = 0;
    for (let x = 0; x < cave.width; x++) {
        for (let y = 0; y < cave.height; y++) {
            if (isLowPoint(cave, { x, y })) {
                yield { x, y };
            }
        }
    }
}

function isLowPoint(cave, coord) {
    let val = cave.lookup(coord);
    return adjacentValues(cave, coord).filter(n => n <= val).length === 0;
}

function adjacentCoords(cave, coord) {
    let { x: x, y: y } = coord;
    let adjacent = [];
    if (y - 1 >= 0) { adjacent.push({ x, y: y - 1 }) };
    if (x + 1 < cave.width) { adjacent.push({ x: x + 1, y }) };
    if (y + 1 < cave.height) { adjacent.push({ x, y: y + 1 }) };
    if (x - 1 >= 0) { adjacent.push({ x: x - 1, y }) };
    return adjacent;
}

function adjacentValues(cave, coord) {
    return adjacentCoords(cave, coord).map(coord => cave.lookup(coord));
}

function smokeBasin2(cave) {
    let basins = [];
    for (let lowPoint of lowPoints(cave)) {
        addBasinAt(cave, basins, lowPoint);
    }
    return basins
        .sort((a, b) => a.size - b.size)
        .slice(-3)
        .reduce((t, b) => t * b.size, 1);
}

function addBasinAt(cave, basins, coord) {
    let key = toKey(coord);
    for (let basin of basins) {
        if (basin.has(key)) {
            return;
        }
    }
    let basin = expandBasin(cave, new Set([key]));
    basins.push(basin);
}

function expandBasin(cave, keys) {
    let origKeysSize = keys.size;
    for (let key of keys) {
        for (let coord of adjacentCoords(cave, toCoord(key))) {
            if (cave.lookup(coord) !== 9) {
                keys.add(toKey(coord));
            }
        }
    }
    return keys.size === origKeysSize ? keys : expandBasin(cave, keys);
}

function toKey(coord) {
    return `${coord.x},${coord.y}`;
}

function toCoord(key) {
    let [x, y] = key.split(',').map(Number);
    return { x, y };
}