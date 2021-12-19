'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day08.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let lines = input.trim().split(/\r?\n/);
    let notes = lines.map(ln => {
        let [varTxt, outTxt] = ln.split(' | ');
        return {
            variations: varTxt.split(' ').map(normSignal),
            output: outTxt.split(' ').map(normSignal)
        };
    });
    cl(sevenSegmentSearch1(notes));
    cl(sevenSegmentSearch2(notes));
});

function normSignal(signal) {
    return [...signal];
}

function sevenSegmentSearch1(notes) {
    return notes.reduce((count, note) =>
        count + note.output.filter(isUniqueLength).length
        , 0);
}

function isUniqueLength(signal) {
    switch (signal.length) {
        case 2: // 1
        case 4: // 4
        case 3: // 7
        case 7: // 8
            return true;
        default:
            return false;
    }
}

function sevenSegmentSearch2(notes) {
    return notes
        .map(note => {
            deduce(note);
            let dict = getDict(note);
            let numStr =
                note.output.map(out => dict.get(sortString(out))).join('');
            return Number(numStr);
        }).reduce((a, b) => a + b);
}

function deduce(note) {
    let vars =
        note.variations.sort(function (a, b) { return a.length - b.length });
    note.wires1 = vars[0];
    note.wires4 = vars[2];
    note.wires7 = vars[1];
    note.wires8 = vars[9];
    note.fiveSegs = vars.slice(3, 6);
    note.sixSegs = vars.slice(6, 9);
    findWires6(note);
    note.c = complement(note.wires1, note.wires6)[0];
    findWires0(note);
    note.wires9 = note.sixSegs[0];
    findWires5(note);
    findWires3(note);
    note.wires2 = note.fiveSegs[0];
}

function findWires6(note) {
    note.wires6 =
        note.sixSegs
            .filter(wires => complement(note.wires1, wires).length === 1)[0];
    note.sixSegs = complement(note.sixSegs, [note.wires6]);
}

function findWires0(note) {
    note.wires0 =
        note.sixSegs
            .filter(wires => complement(note.wires4, wires).length === 1)[0];
    note.sixSegs = complement(note.sixSegs, [note.wires0]);
}

function findWires5(note) {
    note.wires5 =
        note.fiveSegs
            .filter(wires => !wires.includes(note.c))[0];
    note.fiveSegs = complement(note.fiveSegs, [note.wires5]);
}

function findWires3(note) {
    note.wires3 =
        note.fiveSegs
            .filter(wires => complement(wires, note.wires7).length === 2)[0];
    note.fiveSegs = complement(note.fiveSegs, [note.wires3]);
}

function complement(arr1, arr2) {
    return arr1.filter(c => !arr2.includes(c));
}

function getDict(note) {
    let keys =
        [
            note.wires0,
            note.wires1,
            note.wires2,
            note.wires3,
            note.wires4,
            note.wires5,
            note.wires6,
            note.wires7,
            note.wires8,
            note.wires9
        ].map(key => key.sort().join(''));
    let dict = new Map();
    for (let i = 0; i < 10; i++) {
        dict.set(keys[i], String(i));
    }
    return dict;
}

function sortString(str) {
    return [...str].sort().join('');
}
