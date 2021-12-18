'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day05.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let textLines = input.trim().split(/\r?\n/);
    let lines = textLines.map(parseLine);
    cl(hydrothermalVenture(lines, false));
    cl(hydrothermalVenture(lines, true));
});

function parseLine(line) {
    let nums = line.split(/[^0-9]+/).map(Number);
    return { x1: nums[0], y1: nums[1], x2: nums[2], y2: nums[3] }
}

function hydrothermalVenture(lines, incDiagnal) {
    const field = new Map;
    if (!incDiagnal) {
        lines = lines.filter(isHorizOrVert);
    }
    for (const line of lines) {
        for (const pt of points(line)) {
            incPoint(field, pt);
        }
    }
    return Array.from(field.values()).filter(n => n >= 2).length;
}

function isHorizOrVert(line) {
    return line.x1 === line.x2 || line.y1 === line.y2;
}

function* points(ln) {
    const xDiff = ln.x2 - ln.x1
    const xInc = xDiff === 0 ? 0 : (xDiff > 1) ? 1 : -1
    const yDiff = ln.y2 - ln.y1
    const yInc = yDiff === 0 ? 0 : (yDiff > 1) ? 1 : -1
    let done = false;
    let pt = { x: ln.x1, y: ln.y1 };
    yield pt;
    while (!done) {
        pt.x += xInc;
        pt.y += yInc;
        yield pt;
        done = pt.x === ln.x2 && pt.y === ln.y2;
    }
}

function incPoint(field, pt) {
    let key = pt.x + pt.y * 1000;
    if (!field.has(key)) {
        field.set(key, 0);
    }
    field.set(key, field.get(key) + 1);
}
