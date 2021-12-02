const fs = require('fs');

fs.readFile('day02.txt', 'utf-8', (err, input) => {
    if (err) throw err;
    let lines = input.trim().split('\n');
    let data = lines.map(parseLine);
    dive1(data);
    dive2(data);
});

function parseLine(line){
    let parts = line.split(' ');
    return {direction: parts[0], distance: Number(parts[1])};
}

function dive1(data){
    let depth = 0, range = 0;
    data.forEach(instr => {
        let dist = instr.distance;
        switch(instr.direction){
            case 'forward':
                range += dist;
                break;
            case 'up':
                depth -= dist;
                depth = Math.max(0, depth);
                break;
            case 'down':
                depth += dist;
                break;
        }
    });
    console.log(depth * range);
}

function dive2(data){
    let aim =0, depth = 0, range = 0;
    data.forEach(instr => {
        let dist = instr.distance;
        switch(instr.direction){
            case 'forward':
                range += dist;
                depth += (dist * aim)
                depth = Math.max(0, depth);
                break;
            case 'up':
                aim -= dist;
                break;
            case 'down':
                aim += dist;
                break;
        }
    });
    console.log(depth * range);
}
