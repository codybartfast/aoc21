'use strict';
const fs = require('fs');
const cl = console.log;

const empty = '.';

fs.readFile('day25.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    const lines = input.trim().split(/\r?\n/);
    const seabed = lines.map(ln => [...ln]);
    cl(seaCucumber(seabed));
    cl('Merry Christmas!');
});

function seaCucumber(seabed) {
    let movedEast, movedSouth, steps = 0;
    do {
        steps++;
        movedEast = migrateEast(seabed, '>');

        seabed = transpose(seabed);
        movedSouth = migrateEast(seabed, 'v');
        seabed = transpose(seabed);
    } while (movedEast + movedSouth > 0);

    return steps;
}

function transpose(seabed) {
    return seabed[0].map((_, y) => seabed.map(row => row[y]));
}

function migrateEast(seabed, cucumber) {
    const origSeabed = copy(seabed);
    let moveCount = 0;
    const nextEast = ([x, y]) => [(x + 1) % origSeabed[0].length, y];
    const get = ([x, y]) => origSeabed[y][x];
    const set = ([x, y], v) => seabed[y][x] = v;
    for (let y = 0; y < seabed.length; y++) {
        for (let x = 0; x < seabed[0].length; x++) {
            const pos = [x, y];
            if (get(pos) === cucumber) {
                const next = nextEast(pos);
                if (get(next) === empty) {
                    set(next, cucumber);
                    set(pos, empty);
                    x++;
                    moveCount++;
                }
            }
        }
    }
    return moveCount;
}

function copy(seabed) {
    return seabed.map(row => row.slice(0));
}

function display(seabed) {
    for (const row of seabed) {
        cl(row.join(''));
    }
}
