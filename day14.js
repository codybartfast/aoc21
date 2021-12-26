'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day14.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let lines = input.trim().split(/\r?\n/);
    let template = lines[0];
    let insertions = new Map(lines.splice(2).map(ln => ln.split(' -> ')));
    cl(extendedPolymerization(template, insertions));
});

function extendedPolymerization(template, insertions) {
    let polymer = stringToPolymer(template);
    for (let step = 0; step < 10; step++) {
        polymer = extendPolymer(polymer, insertions);
    }
    let [low, high] = lowHigh(polymer);
    return high - low;
}

function lowHigh(polymer) {
    let map = new Map();
    for (let el of polymer) {
        let current = map.get(el);
        map.set(el, current ? current + 1 : 1);
    }
    let low = Infinity, high = -Infinity;
    for (let value of map.values()) {
        low = value < low ? value : low;
        high = value > high ? value : high;
    }
    return [low, high];
}

function* extendPolymer(polymer, insertions) {
    yield* singles(withInsertions(insertions, pairwise(polymer)));
}

function* withInsertions(insertions, pairs) {
    for (let pair of pairs) {
        yield insert(insertions, pair);
    }
}

function insert(insertions, [l, r]) {
    let sub = insertions.get(l + r);
    return sub ? [l, sub, r] : [l, r];
}

function* pairwise(polymer) {
    let prev = undefined;
    for (let el of polymer) {
        if (prev !== undefined) {
            yield [prev, el];
        }
        prev = el;
    }
}

function* singles(parts) {
    let firstCall = true;
    for (let part of parts) {
        if (firstCall) {
            firstCall = false;
            yield part[0];
        }
        yield* part.slice(1);
    }
}

function* stringToPolymer(template) {
    for (let el of template) {
        yield el;
    }
}
