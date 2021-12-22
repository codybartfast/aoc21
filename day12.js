'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day12.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let pairs = input.trim().split(/\r?\n/).map(ln => ln.split('-'));
    cl(passageParsing(pairs));
});

function passageParsing(pairs) {
    let connections = findConnections(pairs);
    let pathCount = 0;
    for (let path of findPaths(connections, ['start'])) {
        pathCount ++;
    }
    return pathCount;
}

function findConnections(pairs) {
    let connections = new Map();
    pairs.forEach(([left, right]) => {
        if (!connections.has(left)) { connections.set(left, new Set()) };
        if (!connections.has(right)) { connections.set(right, new Set()) };
        connections.get(left).add(right);
        connections.get(right).add(left);
    });
    return connections;
}

function* findPaths(connections, path) {
    let here = path.at(-1);
    if (here === 'end') yield path;
    // cl('here', here);
    for (let next of connections.get(here)) {
        if (/[A-Z]/.test(next) || !path.includes(next)) {
            path.push(next);
            yield* findPaths(connections, path);
        }
    }
    path.pop();
}