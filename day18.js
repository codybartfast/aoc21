'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day18.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let lines = input.trim().split(/\r?\n/);
    cl(snailfish1(lines.map(JSON.parse)));
    cl(snailfish2(lines.map(JSON.parse)));
});

function snailfish1(numbers) {
    let r = numbers.reduce(add);
    return magnitude(r);
}

function snailfish2(numbers) {
    let dup = n => JSON.parse(JSON.stringify(n));
    let max = 0;
    for (let a of numbers) {
        for (let b of numbers) {
            if (a !== b) {
                max = Math.max(max, magnitude(add(dup(a), dup(b))));
            }
        }
    }
    return max;
}

function magnitude(n) {
    if (isRegularNumber(n)) {
        return n;
    }
    let [left, right] = n;
    return 3 * magnitude(left) + 2 * magnitude(right);
}

function add(a, b) {
    let n = [a, b];
    reduce(n);
    return n;
}

function reduce(n) {
    do {
        while (explode(n));
    }
    while (split(n));
}

function split(pair) {
    function numToPair(rn) {
        let left = Math.floor(rn / 2);
        return [left, rn - left]
    }
    let [left, right] = pair;
    if (isRegularNumber(left)) {
        if (left > 9) {
            pair[0] = numToPair(left);
            return true;
        }
    } else {
        if (split(left)) {
            return true;
        }
    }
    if (isRegularNumber(right)) {
        if (right > 9) {
            pair[1] = numToPair(right);
            return true;
        }
        return false;
    }
    else {
        return split(right);
    }
}

function explode(n) {
    let findResult = findExplosive(n);
    if (findResult) {
        let [explosive, parent] = findResult;
        distribute(explosive, n);
        if (parent[0] === explosive) {
            parent[0] = 0;
        } else {
            parent[1] = 0;
        }
        return true;
    }
    return false;
}

function findExplosive(n, parents = []) {
    if (isRegularNumber(n)) {
        return false;
    }
    else if (parents.length == 4) {
        return [n, parents[3]];
    }
    else {
        let parentsPlus = [].concat(parents, [n]);
        return findExplosive(n[0], parentsPlus)
            || findExplosive(n[1], parentsPlus);
    }
}

function isPair(n) {
    return Array.isArray(n);
}

function isRegularNumber(n) {
    return !isPair(n);
}

function distribute(pair, root) {
    function orderPairs(pair) {
        let [left, right] = pair;
        let leftPairs = isPair(left) ? orderPairs(left) : [];
        let rightPairs = isPair(right) ? orderPairs(right) : [];
        return leftPairs.concat([pair], rightPairs);
    }
    function updateLeft(n, pair) {
        if (isRegularNumber(pair[0])) {
            pair[0] = pair[0] + n;
            return true;
        }
        else {
            return false;
        }
    }
    function updateRight(n, pair) {
        if (isRegularNumber(pair[1])) {
            pair[1] = pair[1] + n;
            return true;
        }
        else {
            return false;
        }
    }
    let [lVal, rVal] = pair;
    let orderedPairs = orderPairs(root);
    let pairPos = orderedPairs.indexOf(pair);
    let left = orderedPairs.slice(0, pairPos);
    let right = orderedPairs.slice(pairPos + 1);

    for (let pair of left.reverse()) {
        if (updateRight(lVal, pair) || updateLeft(lVal, pair)) {
            break;
        }
    }
    for (let pair of right) {
        if (updateLeft(rVal, pair) || updateRight(rVal, pair)) {
            break;
        }
    }
}
