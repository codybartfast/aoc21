'use strict';
const fs = require('fs');
const cl = console.log;

let nCol = 5;
let nRow = 5;

fs.readFile('day04.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let parts = input.trim().split(/r?\n\r?\n/);
    let numbers = parts[0].split(',').map(Number);
    let boards = parts.slice(1).map(text =>
        text.trim().split(/\s+/).map(Number));
    giantSquid1(numbers, boards);
});

function giantSquid1(numbers, boards) {
    let nBoards = boards.length;
    let nWins = 0;
    numbers.forEach(number => {
        boards.forEach(board => {
            let idx = markNumber(board, number);
            if (idx >= 0) {
                if (checkWinning(board, idx)) {
                    nWins += 1;
                    if (nWins === nBoards) {
                        cl(nWins);
                        cl(board);
                        cl(score(board, number))
                        exit;
                    }
                    board.fill(null);
                }
            }
        });
    });
    cl(boards[99]);
}

function markNumber(board, number) {
    let idx = board.findIndex(n => n === number)
    if (idx >= 0) {
        board[idx] = null;
    }
    return idx;
}

function checkWinning(board, idx) {
    // cl(`Checking: ${idx}`);
    let idxCol = idx % nCol;
    let idxRow = (idx - idxCol) / nRow;

    let rowStart = idx - idxCol;
    let row = board.slice(rowStart, rowStart + nCol);

    let colStart = idxCol
    let col = [];
    for (let i = 0; i < nRow; i++) {
        col.push(board[(colStart + (i * nRow))]);
    }

    return row.every(sqr => sqr === null) || col.every(sqr => sqr === null);
}

function score(board, called) {
    let sum =
        board
            .filter(e => e !== null)
            .reduce((agg, n) => agg + n, 0);
    return sum * called;
}