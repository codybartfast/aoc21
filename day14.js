'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day14.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let lines = input.trim().split(/\r?\n/);
    let template = lines[0];
    let insertions = new Map(lines.splice(2).map(ln => ln.split(' -> ')));
    cl(extendedPolymerization(template, insertions, 10));
    cl(extendedPolymerization(template, insertions, 40));
});

function extendedPolymerization(template, insertions, steps) {
    return twoStageExtend(template, insertions, steps).lowHigh();
}

function twoStageExtend(template, insertions, steps) {
    if (steps % 2 !== 0) throw "Even Stevens";
    let halfSteps = steps / 2;
    let demiStats = new Map();
    for (let pair of insertions.keys()) {
        demiStats.set(pair, getDemiStats(stringToPolymer(pair), insertions, halfSteps));
    }
    let demiPolymer = stringToPolymer(template);
    for (let i = 0; i < halfSteps; i++) {
        demiPolymer = extendPolymer(demiPolymer, insertions);
    }
    let stats = newStats();
    for (let [l, r] of pairwise(demiPolymer)) {
        stats.combine(demiStats.get(l + r));
    }
    stats.inc(template[0]);
    return stats;
}

function getDemiStats(polymer, insertions, steps) {
    let stats = newStats();
    for (let i = 0; i < steps; i++) {
        polymer = extendPolymer(polymer, insertions);
    }
    let skippedFirst = false;
    for (let el of polymer) {
        if (skippedFirst) {
            stats.inc(el);
        }
        else {
            skippedFirst = true;
        }
    }
    return stats;
}

function extendPolymer(polymer, insertions) {
    return singles(withInsertions(insertions, pairwise(polymer)));
}

function* withInsertions(insertions, pairs) {
    for (let pair of pairs) {
        yield insert(insertions, pair);
    }
}

function insert(insertions, [l, r]) {
    return [l, insertions.get(l + r), r];
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

function newStats(sourceMap) {
    const stats = new Map(sourceMap);
    stats.inc = function (el) {
        let current = this.get(el);
        this.set(el, current ? current + 1 : 1);
    }
    stats.combine = function (b) {
        for (let el of b.keys()) {
            let aVal = this.get(el);
            let bVal = b.get(el);
            this.set(el, aVal ? aVal + bVal : bVal);
        }
    }
    stats.lowHigh = function () {
        let low = Infinity, high = -Infinity;
        for (let value of this.values()) {
            low = value < low ? value : low;
            high = value > high ? value : high;
        }
        return high - low;
    }
    return stats;
}

function* stringToPolymer(template) {
    for (let el of template) {
        yield el;
    }
}
