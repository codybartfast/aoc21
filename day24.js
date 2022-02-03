// The Monad program has 14 sections that are identical except for 3 
// hardcoded values labelled A, B & C in the 'naiveRoutine' below.
//
// 'routine', below, is a concise implementation of the naive routine.
//
// A is always 1 or 26.  Further, when A is 1, B is always greater than 9
// so the predicate is never satisfied and z will always be multiplied by 26
// (or if zero z will become non-zero).  I.e. each time A = 1 z increases by
// an order of magnitude.
//
// There are seven sections where A = 1.  So z can be reduced back to zero
// is if z reduced by an order of magnitude each of the seven times A = 26.
// This can only happen if the predicate '(z % 26) + b === w' is satisfied
// everytime A = 26.

'use strict';
const fs = require('fs');
const cl = console.log;
const oneToNine = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const nineToOne = oneToNine.slice(0).reverse();

fs.readFile('day24.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    const lines = input.trim().split(/\r?\n/);
    const sections = [];
    while (lines.length > 0) {
        const section = [];
        for (let i = 0; i < 18; i++) {
            section.push(lines.shift());
        }
        sections.push(section);
    }
    const hardCodedValues = sections.map(findHardCodedValues);
    cl(arithmeticLogicUnit(hardCodedValues, [], 0, true));
    cl(arithmeticLogicUnit(hardCodedValues, [], 0, false));
});

function findHardCodedValues(section) {
    return [
        section[4].substring(6),
        section[5].substring(6),
        section[15].substring(6)
    ].map(Number);
}

function arithmeticLogicUnit(routineArgs, modelNumber, z, goHigh) {
    if (routineArgs.length == 0) {
        return modelNumber.join('');
    }
    const [a, b, c] = routineArgs[0];
    if (a === 1) {
        for (const w of goHigh ? nineToOne : oneToNine) {
            const validModelNumber =
                arithmeticLogicUnit(
                    routineArgs.slice(1),
                    modelNumber.concat([w]),
                    z * 26 + w + c,
                    goHigh);
            if (validModelNumber) {
                return validModelNumber;
            }
        }
        return false;
    } else {
        const w = z % 26 + b;
        if (1 <= w && w <= 9) {
            return arithmeticLogicUnit(
                routineArgs.slice(1),
                modelNumber.concat([w]),
                div(z, 26),
                goHigh);
        } else {
            return false;
        }
    }
}

function div(n, d) {
    return Math.trunc(n / d);
}

// function routine([a, b, c], z, w) {
//     let zDivA = div(z, a);
//     if ((z % 26) + b === w) {
//         return zDivA;
//     }
//     else {
//         return zDivA * 26 + w + c;
//     }
// }

// function naiveRoutine([a, b, c], z, w) {
//     // inp w
//     // mul x 0
//     // add x z
//     let x = z;
//     // mod x 26
//     x = x % 26;
//     // div z 1  <===============  A =  1
//     z = div(z, a);
//     // add x 13 <===============  B = 13
//     x = x + b;
//     // eql x w
//     x = x === w ? 1 : 0;
//     // eql x 0
//     x = x === 0 ? 1 : 0;
//     // mul y 0
//     // add y 25
//     let y = 25;
//     // mul y x
//     y = y * x;
//     // add y 1
//     y = y + 1;
//     // mul z y
//     z = z * y;
//     // mul y 0
//     // add y w
//     y = w;
//     // add y 10 <===============  C = 10
//     y = y + c;
//     // mul y x
//     y = y * x;
//     // add z y
//     z = z + y
//     return z;
// }
