'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day17.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    const [_, left, right, bottom, top] = input.match(
        /target area: x=(\d+)..(\d+), y=(-?\d+)..(-?\d+)/).map(Number);
    const target = { left, right, bottom, top };
    let [apex, options] = trickShot(target);
    cl(apex);
    cl(options);
});

function trickShot(target, cocky) {
    const probes = initialProbes(target);
    const onTargetProbes = [...filter(probes, isOnTarget(target))];
    const apexes = [...onTargetProbes].map(probe => probe.apex);
    return [Math.max(...apexes), onTargetProbes.length];
}

function isOnTarget(target) {
    return probe => {
        const trajStart = takeWhile(trajectory(probe), inScope(target));
        const hits = filter(trajStart, hitsTarget(target));
        for (let _ of hits) {
            return true;
        }
        return false;
    };
}

function* initialProbes(target) {
    // When shot upwards the y values while ascending are revisited when 
    // falling, so it always revisits y=0. So if |dy| > |bottom| we can be 
    // sure it'll be below the target on the next step and miss the target.
    const xMax = target.right;
    const yMax = -target.bottom;
    for (let dx = 1; dx <= xMax; dx++) {
        for (let dy = -yMax; dy <= yMax; dy++) {
            yield { x: 0, y: 0, dx, dy, apex: 0 };
        }
    }
}

function update(probe) {
    probe.x = probe.x += probe.dx;
    probe.y = probe.y += probe.dy;
    probe.dx = probe.dx === 0 ? 0 : probe.dx - 1;
    probe.dy -= 1;
    probe.apex = Math.max(probe.apex, probe.y);
}

function* trajectory(probe) {
    for (; ; update(probe)) {
        yield probe;
    }
}

function inScope(target) {
    return probe => probe.x <= target.right && probe.y >= target.bottom;
}

function hitsTarget(target) {
    return probe =>
        probe.x >= target.left
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
