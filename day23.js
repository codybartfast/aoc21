'use strict';
const fs = require('fs');
const { stringify } = require('querystring');
const cl = console.log;

const empty = -19;

fs.readFile('day23.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    const lines = input.trim().split(/\r?\n/)
    const rooms = [];
    for (let i = 2; i < 9; i += 2) {
        rooms.push({
            pos: i,
            top: ampiNum(lines[2][i + 1]),
            bottom: ampiNum(lines[3][i + 1])
        });
    }
    const hallway = new Array(11).fill(empty);
    amphipod(hallway, rooms);
});

function amphipod(hallway, rooms) {
    const bestCost = { cost: Infinity };
    for (let history of burrowCost(hallway, rooms, 0, bestCost, [])) {
        const [_, __, cost] = history.at(-1);
        cl(cost);
    }
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
    } {
        yield* moveIn(hallway, rooms, cost, bestCost, history);
        yield* moveOut(hallway, rooms, cost, bestCost, history);
    }
}

function* moveIn(origHallway, origRooms, cost, bestCost, history) {
    // cl('... left ampi in ...', history);
    for (let origin = 0; origin < origHallway.length; origin++) {
        if (!isEmpty(origHallway[origin])) {
            const ampi = origHallway[origin];
            if ((roomEmpty(origRooms, ampi)
                || roomHalfDone(origRooms, ampi))
                && pathIsClear(origHallway, origin, origRooms[ampi].pos)
            ) {

                let [hallway, rooms] = copy(origHallway, origRooms);
                const home = rooms[ampi];
                let dist = Math.abs(origin - home.pos);
                if (roomHalfDone(rooms, ampi)) {
                    dist += 1;
                    home.top = ampi;
                }
                else {
                    dist += 2;
                    home.bottom = ampi;
                }
                hallway[origin] = empty;
                const newCost = cost + ampiCost(ampi) * dist;
                yield* burrowCost(hallway, rooms, newCost, bestCost, history);
            }
        }
    }
}

function pathIsClear(hallway, origin, homePos) {
    const step = (origin - homePos) / Math.abs(origin - homePos);
    // cl('step: ', step)
    for (let i = homePos; i < origin; i += step) {
        // cl('testing: ', i);
        if (!isEmpty(hallway[i])) {
            // cl('  ... breaking ...')
            return false; // oh, now you're getting really ugly
        }
    }
    return true;
}

function* moveOut(origHall, origRooms, cost, bestCost, history) {
    // cl('... left ampi out ...', history);
    for (let i = 0; i < origRooms.length; i++) {
        if (!roomDone(origRooms, i)
            && !roomHalfDone(origRooms, i)
            && !roomEmpty(origRooms, i)
        ) {
            const destinations = hwDestinations(origHall, origRooms[i].pos);
            for (let destination of destinations) {
                let [hallway, rooms] = copy(origHall, origRooms);
                const room = rooms[i];
                let stepsOut;
                if (!isEmpty(room.top)) {
                    hallway[destination] = room.top;
                    room.top = empty;
                    stepsOut = 1;
                } else {
                    // cl(room.bottom, isEmpty(origRooms[i].top), )
                    hallway[destination] = room.bottom;
                    room.bottom = empty;
                    stepsOut = 2;
                }
                const newCost = cost + ampiCost(hallway[destination]) *
                    (stepsOut + Math.abs(room.pos - destination));
                yield* burrowCost(hallway, rooms, newCost, bestCost, history);
            }
        }
    }
}

function* hwDestinations(hallway, start) {
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
    return ampiHome === rooms[ampiHome].bottom
        && ampiHome === rooms[ampiHome].top;
}

function roomHalfDone(rooms, ampiHome) {
    return ampiHome === rooms[ampiHome].bottom
        && isEmpty(rooms[ampiHome].top);
}

function roomEmpty(rooms, ampiHome) {
    const r = isEmpty(rooms[ampiHome].bottom);
    if (r && !isEmpty(rooms[ampiHome].top)) {
        throw 'bad dev';
    }
    return r
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
        rooms.map(room =>
            ({ pos: room.pos, top: room.top, bottom: room.bottom }))
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
    const c = (ascii) => String.fromCharCode(ascii + 65);
    for (const [hallway, rooms, cost] of history) {
        const diff = cost - prevCost;
        prevCost = cost;
        cl(' ');
        cl(`cost: ${cost} (+ ${diff})`);
        cl('#############');
        cl('#' + hallway.map(c).join('') + '#');
        cl(`###${c(rooms[0].top)}#${c(rooms[1].top)}#${c(rooms[2].top)}#${c(rooms[3].top)}###`)
        cl(`  #${c(rooms[0].bottom)}#${c(rooms[1].bottom)}#${c(rooms[2].bottom)}#${c(rooms[3].bottom)}#`)
        cl('  #########');
    }
}