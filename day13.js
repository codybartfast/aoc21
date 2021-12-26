'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day13.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let sections = input.trim().split(/(\r?\n){2,}/);
    let dots = sections[0].split(/\r?\n/).map(textToDot);
    let folds = sections[2].split(/\r?\n/).map(ln => {
        let [axis, val] = ln.split(' ')[2].split('=');
        return [axis, Number(val)];
    });
    cl(transparentOrigami1(dots, folds));
    cl(transparentOrigami2(dots, folds));
});

function transparentOrigami1(dots, folds) {
    return applyFold(dots, folds[0]).length;
}

function transparentOrigami2(dots, folds) {
    let folded = folds.reduce(applyFold, dots);
    let xLen = 1 + Math.max(...folded.map(([x, _]) => x));
    let yLen = 1 + Math.max(...folded.map(([_, y]) => y));
    let sheet = //new Array(maxY + 1).fill('0').map(el => 'blah')
        (new Array(yLen)).fill(0)
            .map(_ => new Array(xLen).fill(' '));
    folded.forEach(([x, y]) => sheet[y][x] = '#');
    return sheet.map(row => cl(row.join(''))).join('');
}

function applyFold(dots, [axis, line]) {
    let dim = axis === 'x' ? 0 : 1;
    dots = dots.filter(dot => dot[dim] !== line);
    dots.filter(dot => dot[dim] > line)
        .forEach(dot => dot[dim] = 2 * line - dot[dim]);
    return dedup(dots);
}

function dedup(dots) {
    return [...(new Set(dots.map(dotToText)))].map(textToDot);
}

function textToDot(txt) {
    return txt.split(',').map(Number);
}

function dotToText([x, y]) {
    return x + ',' + y;
}
