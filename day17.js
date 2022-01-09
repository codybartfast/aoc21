'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day17.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    const [_, left, right, bottom, top] = input.match(
        /target area: x=(\d+)..(\d+), y=(-?\d+)..(-?\d+)/).map(Number);
    const target = { left, right, bottom, top };
    cl(trickShot(target));
});

function trickShot(target) {
    const findApex = probe => findOntargetApex(target, probe);
    const hits = filter(initialProbes(target), findApex);
    return Math.max(...[...hits].map(probe => probe.apex));
}

function findOntargetApex(target, probe) {
    const isCandidate = probe => inScope(target, probe);
    const trajStart = takeWhile(trajectory(probe), isCandidate);
    const isHit = probe => hitTarget(target, probe);
    const hits = filter(trajStart, isHit);
    for (let hit of hits) {
        return hit;
    }
    return false;
}

function* initialProbes(target) {
    // When shot upwards the y values while ascending are revisited when 
    // falling, so it always revisits y=0. So if dy > ¬bottom¬ we can be 
    // sure it'll be below the target on the next step and miss the target.
    const xMax = target.right;
    const yMax = -target.bottom;
    for (let dx = 1; dx <= xMax; dx++) {
        for (let dy = 1; dy <= yMax; dy++) {
            yield { x: 0, y: 0, dx, dy, apex: 0 };
        }
    }
}

function steps(probe) {
    probe.x = probe.x += probe.dx;
    probe.y = probe.y += probe.dy;
    probe.dx = probe.dx === 0 ? 0 : probe.dx - 1;
    probe.dy -= 1;
    probe.apex = Math.max(probe.apex, probe.y);
}

function* trajectory(probe) {
    for (; ; steps(probe)) {
        yield probe;
    }
}

function inScope(target, probe) {
    return probe.x <= target.right && probe.y >= target.bottom;
}

function hitTarget(target, probe) {
    return probe.x >= target.left
        && probe.y <= target.top
        && probe.x <= target.right
        && probe.y >= target.bottom;
}

function* takeWhile(generator, predicate) {
    for (let item of generator) {
        if (predicate(item)) {
            yield item;
        } else {
            break;
        }
    }
}

function* filter(generator, predicate) {
    for (let item of generator) {
        if (predicate(item)) {
            yield item;
        }
    }
}

function tryFirst(generator) {
    for (let item of generator) {
        return item;
    }
    return false;
}
