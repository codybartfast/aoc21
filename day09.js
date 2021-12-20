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
    cl(smokeBasin(cave));
});

function smokeBasin(cave) {
    let risk = 0;
    for(let x = 0; x < cave.width; x++){
        for(let y = 0; y < cave.height; y++){
            if(isLowPoint(cave, {x, y})){
                risk += 1 + cave.lookup({x, y});
            }
        }
    }
    return risk;
}

function isLowPoint(cave, coord){
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

