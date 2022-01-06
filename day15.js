'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day15.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let inputGrid =
        input.trim().split(/\r?\n/).map(ln => [...ln].map(Number));
    cl(chiton(toCave(inputGrid)));
    cl(chiton(toCave(enlarge(inputGrid))));
});

const start = { x: 0, y: 0 };

function exit(cave) {
    return { x: cave.width - 1, y: cave.height - 1 };
}

function toCave(grid) {
    let cave = grid.map(row =>
        row.map(n => ({ risk: n, pathRisk: Infinity })));
    cave.width = cave[0].length;
    cave.height = cave.length;
    info(cave, start).pathRisk = 0;
    return cave;
}

function chiton(cv) {
    let modified = [start];
    while ((modified = extendAll(cv, modified)).length);
    return info(cv, exit(cv)).pathRisk;
}

function extendAll(cv, positions) {
    return dedup([].concat(...positions.map(pos => extendPos(cv, pos))));
}

function extendPos(cv, pos) {
    let modded = []
    let pathRisk = info(cv, pos).pathRisk;
    for (let adj of adjacent(cv, pos)) {
        let adjInfo = info(cv, adj);
        let goAdjRisk = pathRisk + adjInfo.risk;
        if (goAdjRisk < adjInfo.pathRisk) {
            adjInfo.pathRisk = goAdjRisk;
            modded.push(adj);
        }
    }
    return modded;
}

function adjacent(cv, pos) {
    let { x: x, y: y } = pos;
    let adjacent = [];
    if (y - 1 >= 0) { adjacent.push({ x, y: y - 1 }) };
    if (x + 1 < cv.width) { adjacent.push({ x: x + 1, y }) };
    if (y + 1 < cv.height) { adjacent.push({ x, y: y + 1 }) };
    if (x - 1 >= 0) { adjacent.push({ x: x - 1, y }) };
    return adjacent;
}

function info(cave, pos) {
    return cave[pos.y][pos.x];
}

function dedup(positions) {
    function textToPos(txt) {
        let [x, y] = txt.split(',').map(Number);
        return { x, y };
    }
    function posToText({ x = x, y = y }) {
        return x + ',' + y;
    }
    return [...(new Set(positions.map(posToText)))].map(textToPos);
}

function enlarge(grid) {
    grid = grid.slice(0);
    for (let row of grid) {
        let oldLen = row.length;
        let newLen = oldLen * 5;
        for (let x = oldLen; x < newLen; x++) {
            row.push(Math.max(1, (row[x - oldLen] + 1) % 10));
        }
    }
    let oldHeight = grid.length;
    let newHeight = oldHeight * 5;
    for (let y = oldHeight; y < newHeight; y++) {
        let row = [];
        for (let risk of grid[y - oldHeight]) {
            row.push(Math.max(1, (risk + 1) % 10));
        }
        grid.push(row);
    }
    return grid;
}
