'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day20.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    const lines = input.trim().split(/\r?\n/);
    const algo = [...lines[0]].map(c => c === '#' ? 1 : 0);
    const imgLines = lines.slice(2).map(ln => [...ln]);
    const original = imgLines.map(row => row.map(x => x === '#' ? 1 : 0))
    trenchMap(algo, original, 2);
    trenchMap(algo, original, 50);
});

function trenchMap(algo, image, iterations) {
    let tnValue = 0;
    enlarge(image, tnValue);
    for (let x = 0; x < iterations; x++) {
        const nextTNValue = tnValue ? algo.at(-1) : algo[0];
        image = enhance(algo, image, tnValue, nextTNValue);
        tnValue = nextTNValue;
    }
    cl(image.reduce((acc, row) =>
        row.reduce((acc, n) => acc + Number(n), acc), 0));
}

function enhance(algo, image, tnValue, nextTNValue) {
    function enhancePixel(x, y) {
        let idx = 0;
        for (let [xx, yy] of nhood(x, y)) {
            idx = idx << 1
            idx += image[yy][xx];
        }
        return algo[idx];
    }
    const newImage = new Array(image.length).fill(0).map(_ =>
        new Array(image[0].length).fill(0));
    enlarge(image, tnValue);
    enlarge(newImage, nextTNValue);
    let height = newImage.length;
    let width = newImage[0].length;
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            newImage[y][x] = enhancePixel(x, y);
        }
    }
    return newImage;
}

function enlarge(image, tnValue) {
    image.forEach(row => {
        row.push(tnValue);
        row.unshift(tnValue);
    })
    const len = image[0].length;
    const top = new Array(len).fill(tnValue);
    const bottom = new Array(len).fill(tnValue);
    image.unshift(top);
    image.push(bottom);
}

function nhood(x, y) {
    return [
        [x - 1, y - 1], [x, y - 1], [x + 1, y - 1],
        [x - 1, y], [x, y], [x + 1, y],
        [x - 1, y + 1], [x, y + 1], [x + 1, y + 1]
    ];
}
