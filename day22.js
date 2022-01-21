'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day22.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    const lines = input.trim().split(/\r?\n/)
    function cubs() {
        return lines.map(line => {
            let power = line.substring(0, 3) === 'on ';
            let bounds = line.match(/-?\d+/g).map(Number);
            return newCubList(power, bounds);
        });
    }
    cl(reactorReboot(cubs().map(trim50).filter(isReal)));
    cl(reactorReboot(cubs()));
});

function reactorReboot(cubs) {
    let reactor = [];
    for (let cub of cubs) {
        reactor = add(reactor, cub);
    }
    let count = 0;
    for (let cub of reactor) {
        const sz = size(cub);
        count += sz;
    }
    return count;
}

function* add(reactor, cub) {
    for (let existing of reactor) {
        if (areSeparate(existing, cub)) {
            yield existing;
        } else {
            yield* update(existing, cub);
        }
    }
    if (cub.power) {
        yield cub
    };
}

function* update(old, cub) {
    if (areSeparate(old, cub)) {
        yield old;
    }
    else {
        yield* [
            left(old.dimensions, cub.dimensions),
            right(old.dimensions, cub.dimensions),
            top(old.dimensions, cub.dimensions),
            bottom(old.dimensions, cub.dimensions),
            back(old.dimensions, cub.dimensions),
            front(old.dimensions, cub.dimensions)
        ].map(dimensions => newCub(old.power, dimensions))
            .filter(isReal);
    }
}

// With X=left/right, y=up/down, z=front/back

//           ##########
//    ###    #  top   #    ###
//    # #    ##########    # #
//    #l#                  #r#
//    #e#    ##########    #i#
//    #f#    # front  #    #g#
//    #t#    ##########    #h#
//    # #                  #t#
//    # #    ##########    # #
//    ###    # bottom #    ###
//           ##########

function left([[x1Low], yDims1, zDims1], [[x2Low]]) {
    return [[x1Low, x2Low - 1], yDims1, zDims1];
}

function right([[_x1Low, x1High], yDims1, zDims1], [[_x2Low, x2High]]) {
    return [[x2High + 1, x1High], yDims1, zDims1];
}

function bottom([[x1Low, x1High], [y1Low], zDims1]
    , [[x2Low, x2High], [y2Low]]) {
    const xDim = [Math.max(x1Low, x2Low), Math.min(x1High, x2High)];
    return [xDim, [y1Low, y2Low - 1], zDims1];
}

function top([[x1Low, x1High], [_y1Low, y1High], zDims1]
    , [[x2Low, x2High], [_y2Low, y2High]]) {
    const xDim = [Math.max(x1Low, x2Low), Math.min(x1High, x2High)];
    return [xDim, [y2High + 1, y1High], zDims1];
}

function back([[x1Low, x1High], [y1Low, y1High], [z1Low]]
    , [[x2Low, x2High], [y2Low, y2High], [z2Low]]) {
    const xDim = [Math.max(x1Low, x2Low), Math.min(x1High, x2High)];
    const yDim = [Math.max(y1Low, y2Low), Math.min(y1High, y2High)];
    return [xDim, yDim, [z1Low, z2Low - 1]];
}

function front([[x1Low, x1High], [y1Low, y1High], [_z1Low, z1High]]
    , [[x2Low, x2High], [y2Low, y2High], [_z2Low, z2High]]) {
    const xDim = [Math.max(x1Low, x2Low), Math.min(x1High, x2High)];
    const yDim = [Math.max(y1Low, y2Low), Math.min(y1High, y2High)];
    return [xDim, yDim, [z2High + 1, z1High]];
}

function areSeparate(cub1, cub2) {
    for (let i = 0; i < cub1.dimensions.length; i++) {
        let [low1, high1] = cub1.dimensions[i];
        let [low2, high2] = cub2.dimensions[i];
        if (low1 > high2 || low2 > high1) {
            return true;
        }
    }
    return false;
}

function isReal(cub) {
    for (let [low, high] of cub.dimensions) {
        if (high < low) {
            return false;
        }
    }
    return true;
}

function size(cub) {
    const length = ([low, high]) => 1 + high - low;
    return cub.dimensions.map(length).reduce((a, b) => a * b);
}

function trim50(cub) {
    cub.dimensions = cub.dimensions.map(([low, high]) => [Math.max(low, -50), Math.min(high, 50)]);
    return cub;
}

function newCubList(power, list) {
    const dimensions = [
        list.slice(0, 2),
        list.slice(2, 4),
        list.slice(4, 6)
    ]
    return newCub(power, dimensions);
}

function newCub(power, dimensions) {
    return {
        power,
        dimensions
    };
}
