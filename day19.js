'use strict';
const fs = require('fs');
const cl = console.log;

// Distances are constant and, thanks to Eric Elf, unique.  If a probe is 
// scanned by two scanners then the distances between it and the other 11 
// probes in the overlap will be common to both scanners.  There's a total
// of 66 distances between 12 probes (11 + 10 + ... + 2 + 1) so we expect
// at least 66 distances to be common between overlapping scanners.

const minInCommonDistances = 11;
const minScannerOverlap = 66;

fs.readFile('day19.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let scans =
        input.trim().split(/\s*---.*---\s*/).slice(1).map(
            txt =>
                txt.split(/\r?\n/).map(ln => ln.split(',').map(Number)));
    beaconScanner(scans);
});

function beaconScanner(scans) {
    let scanners = getScanners(scans);
    let scannerCombos = combos(scanners);
    let finished = () => scanners.filter(s => !s.isOrientated).length === 0;
    while (!finished()) {
        scannerCombos.forEach(tryOrientate);
    }
    cl(countProbes(scanners));
    cl(scannerCombos.reduce((acc, [a, b]) =>
        Math.max(acc, distance(a.pos, b.pos)), 0))
}

function tryOrientate([s1, s2]) {
    if (s1.isOrientated !== s2.isOrientated && s1.overlaps(s2)) {
        let [adjusted, other] = s1.isOrientated ? [s1, s2] : [s2, s1];
        let [[adjustedPrb1, OtherPrb1], [adjustedPrb2, OtherPrb2]] =
            commonProbes(adjusted, other);
        let adjustedVect = sub(adjustedPrb1.pos, adjustedPrb2.pos);
        let otherVect = sub(OtherPrb1.pos, OtherPrb2.pos);
        let rotate = getRotate(adjustedVect, otherVect);
        other.probes.forEach(probe => probe.pos = rotate(probe.pos));
        let shift = sub(adjustedPrb1.pos, OtherPrb1.pos);
        other.pos = shift;
        other.probes.forEach(probe => probe.pos = add(probe.pos, shift));
        other.isOrientated = true;
    }
}

function getRotate([x, y, z], vect2) {
    function getPicker(n) {
        for (let i = 0; i < vect2.length; i++) {
            if (Math.abs(n) === Math.abs(vect2[i])) {
                return [i, n / vect2[i]];
            }
        }
    }
    const pickers = [getPicker(x), getPicker(y), getPicker(z)];
    return v => pickers.map(([idx, factor]) => v[idx] * factor);
}

function commonProbes(s1, s2) {
    let common = [];
    for (let p1 of s1.probes) {
        for (let p2 of s2.probes) {
            let inCommonDistances =
                intersection(new Set(p1.distances), new Set(p2.distances));
            if (inCommonDistances.size >= minInCommonDistances) {
                common.push([p1, p2]);
            }
        }
    }
    return common;
}

function countProbes(scanners) {
    return scanners.reduce((posStrs, scanner) =>
        union(posStrs, scanner.probes.map(pb => pb.pos.join())),
        new Set()
    ).size;
}

function getScanners(scans) {
    let scanners = scans.map(newScanner);
    let scanner0 = scanners[0];
    scanner0.isOrientated = true;
    scanner0.pos = [0, 0, 0];
    return scanners;
}

function newScanner(scan) {
    scan.map(x => x);
    const scanner = { isOrientated: false };
    scanner.probes = scan.map(rdg => newProbe(rdg, scan));
    scanner.distances =
        scanner.probes.reduce((ds, probe) =>
            probe.distances.reduce((ds, d) => ds.add(d), ds)
            , new Set());
    scanner.overlaps = function (b) {
        const overlap = intersection(this.distances, b.distances);
        return overlap.size >= minScannerOverlap;
    };
    return scanner;
}

function newProbe(scanEntry, scan) {
    const probe = {};
    probe.pos = scanEntry;
    probe.distances = scan
        .map(other => distance(scanEntry, other))
        .filter(d => d != 0);
    probe.overlap = function (b) {
        return intersection(this.distances, b.distances);
    }
    return probe;
}

function combos(arr) {
    const combos = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            combos.push([arr[i], arr[j]]);
        }
    }
    return combos;
}

function distance([x1, y1, z1], [x2, y2, z2]) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2) + Math.abs(z1 - z2);
}

function union(setA, setB) {
    let union = new Set(setA)
    for (let elem of setB) {
        union.add(elem)
    }
    return union
}

function intersection(a, b) {
    let int = new Set()
    for (let elem of b) {
        if (a.has(elem)) {
            int.add(elem)
        }
    }
    return int
}

function add([x1, y1, z1], [x2, y2, z2]) {
    return [x1 + x2, y1 + y2, z1 + z2];
}

function sub([x1, y1, z1], [x2, y2, z2]) {
    return [x1 - x2, y1 - y2, z1 - z2];
}
