'use strict';
const fs = require('fs');
const cl = console.log;

const boardSize = 10;

fs.readFile('day21.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    const players = input.trim().split(/\r?\n/).map(newPlayer);
    cl(diracDice1(players.map(copyPlayer)));
    cl(diracDice2(players));
});

function diracDice2(players) {
    const wins = play(players[0], players[1], new Map(), calcDiceFutures());
    return Math.max(...wins);
}

function play(player, otherPlayer, history, diceFutures) {
    let wins;
    let histKey = historyKey(player, otherPlayer);
    if (otherPlayer.score >= 21) {
        return [0, 1];
    } else if (wins = history.get(histKey)) {
        return wins.reverse(); // I don't get why I need this reverse :-(
    } else {
        wins = diceFutures.map(([moves, frequency]) => {
            const futurePlayer = copyPlayer(player);
            futurePlayer.pos = circAdd(futurePlayer.pos, moves, boardSize);
            futurePlayer.score += futurePlayer.pos;
            let futureWins =
                play(otherPlayer, futurePlayer, history, diceFutures)
                    .reverse();
            return scale(futureWins, frequency);
        }).reduce(([a, b], [c, d]) => [a + c, b + d]);
        history.set(histKey, wins);
        return history.get(histKey);
    }
}

function historyKey(p1, p2) {
    return `${p1.score},${p1.pos},${p2.score},${p2.pos}`
}

function scale([a, b], factor) {
    return [a * factor, b * factor];
}

function calcDiceFutures() {
    let totals = new Array(10).fill(0);
    for (let i = 1; i <= 3; i++) {
        for (let j = 1; j <= 3; j++) {
            for (let k = 1; k <= 3; k++) {
                totals[i + j + k]++;
            }
        }
    }
    let futures = [];
    for (let i = 0; i < totals.length; i++) {
        let count = totals[i];
        if (count > 0) {
            futures.push([i, count])
        }
    }
    return futures;
}

function diracDice1(players) {
    let diceVal = 0;
    let diceRolls = 0;
    while (true) {
        for (let player of players) {
            let moves = 0;
            for (let i = 0; i < 3; i++) {
                moves += (diceVal = circAdd(diceVal, 1, 100));
                diceRolls++;
            }
            player.score +=
                (player.pos = circAdd(player.pos, moves, boardSize));
            if (player.score >= 1000) {
                const loser = players.filter(p => p.score < 1000)[0];
                return loser.score * diceRolls;
            }
        }
    }
}

function newPlayer(ln) {
    return { pos: parseInt(ln.at(-1)), score: 0 };
}

function copyPlayer(player) {
    return { pos: player.pos, score: player.score };
}

function circAdd(a, b, limit) {
    return ((a + b - 1) % limit) + 1;
}
