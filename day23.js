'use strict';
const fs = require('fs');
const cl = console.log;

const empty = -19;

fs.readFile('day23.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    const lines1 = input.trim().split(/\r?\n/);
    const lines2 = lines1.slice(0, 3).concat(
        ['  #D#C#B#A#', '  #D#B#A#C#'],
        lines1.slice(3));
    const [hallway1, rooms1] = newBurrow(lines1);
    cl(amphipod(hallway1, rooms1));
    const [hallway2, rooms2] = newBurrow(lines2);
    cl(amphipod(hallway2, rooms2));
});

function newBurrow(lines) {
    const rooms = [];
    for (let x = 3; x < 10; x += 2) {
        const room = [];
        room.pos = x - 1;
        for (let y = 2; y < lines.length - 1; y++) {
            room.push(ampiNum(lines[y][x]))
        }
        rooms.push(room);
    }
    return [new Array(11).fill(empty), rooms];
}

function amphipod(hallway, rooms) {
    const bestCost = { cost: Infinity };
    const histories = burrowCost(hallway, rooms, 0, bestCost, []);
    let history;
    for (history of histories);
    // displayHistory(history);
    return history.at(-1)[2];
}

function* burrowCost(hallway, rooms, cost, bestCost, history) {
    if (cost >= bestCost.cost) {
        return;
    }
    history = history.slice(0)
    history.push([hallway, rooms, cost]);
    if (allRoomsDone(rooms)) {
        bestCost.cost = Math.min(bestCost.cost, cost);
        yield history;
    } else {
        yield* moveIn(hallway, rooms, cost, bestCost, history);
        yield* moveOut(hallway, rooms, cost, bestCost, history);
    }
}

function* moveIn(origHallway, origRooms, cost, bestCost, history) {
    for (let origin = 0; origin < origHallway.length; origin++) {
        if (!isEmpty(origHallway[origin])) {
            const ampi = origHallway[origin];
            if (!hasVisitor(origRooms, ampi)
                && hallIsClear(origHallway, origin, origRooms[ampi].pos)
            ) {
                let [hallway, rooms] = copy(origHallway, origRooms);
                const home = rooms[ampi];
                let dist = Math.abs(origin - home.pos);
                let i = 0;
                for (; i < home.length && isEmpty(home[i + 1]); i++);
                dist += (i + 1);
                home[i] = ampi;
                hallway[origin] = empty;
                const newCost = cost + ampiCost(ampi) * dist;
                yield*
                    burrowCost(hallway, rooms, newCost, bestCost, history);
            }
        }
    }
}

function hallIsClear(hallway, origin, homePos) {
    const step = (origin - homePos) / Math.abs(origin - homePos);
    for (let i = homePos; i != origin; i += step) {
        if (!isEmpty(hallway[i])) {
            return false;
        }
    }
    return true;
}

function* moveOut(origHall, origRooms, cost, bestCost, history) {
    for (let rmIdx = 0; rmIdx < origRooms.length; rmIdx++) {
        if (!roomDone(origRooms, rmIdx) && hasVisitor(origRooms, rmIdx)) {
            const destinations =
                hallwayDestinations(origHall, origRooms[rmIdx].pos);
            for (let destination of destinations) {
                let [hallway, rooms] = copy(origHall, origRooms);
                const room = rooms[rmIdx];
                let stepsOut;

                let i = 0;
                for (; isEmpty(room[i]); i++);
                hallway[destination] = room[i];
                room[i] = empty;
                stepsOut = i + 1;

                const newCost = cost + ampiCost(hallway[destination]) *
                    (stepsOut + Math.abs(room.pos - destination));
                yield*
                    burrowCost(hallway, rooms, newCost, bestCost, history);
            }
        }
    }
}

function* hallwayDestinations(hallway, start) {
    for (let i = start + 1; i < hallway.length; i++) {
        if (!isLobby(i)) {
            if (!isEmpty(hallway[i])) {
                break
            }
            yield i;
        }
    }
    for (let i = start - 1; i >= 0; i--) {
        if (!isLobby(i)) {
            if (!isEmpty(hallway[i])) {
                break
            }
            yield i;
        }
    }
}

function allRoomsDone(rooms) {
    for (let i = 0; i < rooms.length; i++) {
        if (!roomDone(rooms, i)) {
            return false;
        }
    }
    return true;
}

function roomDone(rooms, ampiHome) {
    for (const val of rooms[ampiHome]) {
        if (val != ampiHome) {
            return false;
        }
    }
    return true;
}

function hasVisitor(rooms, ampiHome) {
    for (const val of rooms[ampiHome]) {
        if (!isEmpty(val) && val != ampiHome) {
            return true;
        }
    }
    return false;
}

function isLobby(i) {
    switch (i) {
        case 2:
        case 4:
        case 6:
        case 8:
            return true;
        default:
            return false;
    }
}

function isEmpty(x) {
    return x === empty;
}

function copy(hallway, rooms) {
    return [
        hallway.slice(0),
        rooms.map(room => {
            const newRoom = room.slice(0);
            newRoom.pos = room.pos;
            return newRoom;
        })
    ];
}

function ampiNum(ampi) {
    return ampi.charCodeAt(0) - 65;
}

function ampiCost(ampi) {
    return 10 ** ampi;
}

function displayHistory(history) {
    let prevCost = 0;
    for (const [hallway, rooms, cost] of history) {
        const diff = cost - prevCost;
        prevCost = cost;
        cl(' ');
        cl(`cost: ${cost} (+ ${diff})`);
        displayBurrow(hallway, rooms);
    }
}

function displayBurrow(hallway, rooms) {
    const toChar = (ascii) => String.fromCharCode(ascii + 65);
    cl('#############');
    cl('#' + hallway.map(toChar).join('') + '#');
    cl(`###${toChar(rooms[0][0])}#${toChar(rooms[1][0])}#${toChar(rooms[2][0])}#${toChar(rooms[3][0])}###`)
    for (let i = 1; i < rooms[0].length; i++) {
        cl(`  #${toChar(rooms[0][i])}#${toChar(rooms[1][i])}#${toChar(rooms[2][i])}#${toChar(rooms[3][i])}#`);
    }
    cl('  #########');
}
