'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day10.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let lines = input.trim().split(/\r?\n/).map(ln => [...ln]);
    cl(syntaxScoring1(lines));
    cl(syntaxScoring2(lines));
});

function syntaxScoring1(lines) {
    return lines
        .map(line => check(line))
        .filter(rslt => !rslt.valid)
        .reduce((sum, rslt) => sum + charScore1(rslt.char), 0);
}

function check(line, open = []) {
    let remaining = line.slice(0);
    if (remaining.length === 0) {
        return { valid: true, open };
    }
    let char = remaining.shift();
    let closingChar;
    if (closingChar = isOpening(char)) {
        open.push(closingChar);
        return check(remaining, open);
    }
    return char === open.pop() ?
        check(remaining, open) :
        { valid: false, char };
}

function isOpening(c) {
    switch (c) {
        case '(':
            return ')';
        case '[':
            return ']';
        case '{':
            return '}';
        case '<':
            return '>';
        default:
            return false;
    }
}

function charScore1(c) {
    switch (c) {
        case ')':
            return 3;
        case ']':
            return 57;
        case '}':
            return 1197;
        case '>':
            return 25137;
    }
}

function syntaxScoring2(lines) {
    let scores = lines
        .map(line => check(line))
        .filter(rslt => rslt.valid)
        .map(rslt =>
            rslt.open.reverse()
                .reduce((agg, char) => agg * 5 + charScore2(char), 0))
        .sort((a, b) => a - b);
    return scores[(scores.length - 1) / 2];
}

function charScore2(c) {
    switch (c) {
        case ')':
            return 1;
        case ']':
            return 2;
        case '}':
            return 3;
        case '>':
            return 4;
    }
}
