'use strict';
const exp = require('constants');
const fs = require('fs');
const cl = console.log;

fs.readFile('day16.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let transmisionions =
        input.trim().split(/\r?\n/)
            .map(parse)
            .map(bits => new Transmission(bits));
    for (let trans of transmisionions) {
        const pkt = readPacket(trans);
        cl(eval1(pkt));
    }
});

function eval1(packet) {
    let vSum = packet.version
    if (packet.type !== 4) {
        vSum += packet.payload.map(eval1).reduce((a, b) => a + b);
    }
    return vSum;
}

function readPacket(transmission) {
    const version = readVersion(transmission);
    const type = readType(transmission);
    const payload = readPayload(transmission, type);
    return { version, type, payload };
}

function readVersion(trans) {
    return parseInt(trans.read(3), 2);
}

function readType(trans) {
    return parseInt(trans.read(3), 2);
}

function readPayload(trans, type) {
    return type === 4 ? readLiteral(trans) : readOperator(trans, type);
}

function readOperator(trans, type) {
    const countPackets = Number(trans.read(1));
    const expected = parseInt(trans.read(countPackets ? 11 : 15), 2);
    const initialReadCount = trans.readCount;
    let subPackets = [];
    const bitCount = () => trans.readCount - initialReadCount;
    const pktCount = () => subPackets.length;
    function done() {
        const actual = countPackets ? pktCount() : bitCount();
        return actual < expected ? false :
            actual === expected ? true :
                (() => { throw `Actual is greater then Expected!` })();
    }

    while (!done()) {
        subPackets.push(readPacket(trans));
    }
    return subPackets;
}

function readLiteral(trans) {
    const chunkLen = 5;
    function readChunks(num) {
        const chunk = trans.read(chunkLen);
        num = (num << (chunkLen - 1)) + parseInt(chunk.substring(1), 2);
        return (chunk[0] === '1') ? readChunks(num) : num;
    }
    return readChunks(0);
}

function Transmission(bitString) {
    this.bits = bitString;
    this.readCount = 0;
    this.remaining = bitString.length;
    this.read = function (n) {
        if (n > this.remaining) {
            throw `Attempted to read ${n} bits but only ${this.remaining} remain`;
        }
        const r = this.bits.substring(0, n);
        this.bits = this.bits.substring(n);
        this.readCount += n;
        this.remaining -= n;
        return r;
    };

    // this.align = function () {
    //     const partRead = this.readCount % bitsPerHex;
    //     if (partRead !== 0) {
    //         this.read(bitsPerHex - partRead);
    //     }
    // }
}

function parse(line) {
    return [...line].map(hexCharToBits).join('');
}

function hexCharToBits(c) {
    return parseInt(c, 16).toString(2).padStart(4, '0');
}
