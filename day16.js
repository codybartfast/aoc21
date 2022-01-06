'use strict';
const fs = require('fs');
const cl = console.log;

fs.readFile('day16.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    const transmission = new Transmission(hexToBits(input.trim()));
    const packet = readPacket(transmission);
    cl(packetDecoder1(packet));
    cl(packetDecoder2(packet));
});

function packetDecoder1(packet) {
    let verSum = packet.version
    if (packet.type !== 4) {
        verSum +=
            packet.payload.map(packetDecoder1).reduce((a, b) => a + b);
    }
    return verSum;
}

function packetDecoder2(packet) {
    if (packet.type === 4) {
        return packet.payload;
    }
    const args = packet.payload.map(packetDecoder2);
    switch (packet.type) {
        case 0:
            return args.reduce((a, b) => a + b);
        case 1:
            return args.reduce((a, b) => a * b);
        case 2:
            return Math.min(...args);
        case 3:
            return Math.max(...args);
        case 5:
            return args[0] > args[1] ? 1 : 0;
        case 6:
            return args[0] < args[1] ? 1 : 0;
        case 7:
            return args[0] === args[1] ? 1 : 0;
        default:
            throw `Unexpected operator type ${packet.type}`;
    }
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
    return type === 4 ? readLiteral(trans) : readOperator(trans);
}

function readLiteral(trans) {
    const chunkLen = 5;
    function readChunks(num) {
        const chunk = trans.read(chunkLen);
        num = (num * 16) + parseInt(chunk.substring(1), 2);
        return (chunk[0] === '1') ? readChunks(num) : num;
    }
    return readChunks(0);
}

function readOperator(trans) {
    const countPackets = Number(trans.read(1));
    const expected = parseInt(trans.read(countPackets ? 11 : 15), 2);
    const initialReadCount = trans.readCount;
    const subPackets = [];
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

function Transmission(bitString) {
    this.bits = bitString;
    this.readCount = 0;
    this.read = function (n) {
        const r = this.bits.substring(0, n);
        this.bits = this.bits.substring(n);
        this.readCount += n;
        return r;
    };
}

function hexToBits(hexStr) {
    const hexCharToBits = c => parseInt(c, 16).toString(2).padStart(4, '0');
    return [...hexStr].map(hexCharToBits).join('');
}
