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
    cl(transparentOrigami(dots, folds));
});

function transparentOrigami(dots, folds) {
    return applyFold(dots, folds[0]).length;
}

function applyFold(dots, fold) {
    let [axis, line] = fold
    let idx =
        axis === 'x' ? 0 :
            axis === 'y' ? 1 :
                function () { throw 'which axis?' };
    dots = dots.filter(dot => dot[idx] !== line)
    dots
        .filter(dot => dot[idx] > line)
        .forEach(dot => dot[idx] = 2 * line - dot[idx]);
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
