const fs = require('fs');

fs.readFile('day01.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    let lines = data.trim().split('\n');
    sonarSweep1(lines);
    sonarSweep2(lines);
});

function sonarSweep1(lines){
    let depths = lines.map(Number)
    console.log(countIncreases(depths));
}

function countIncreases(depths){
    let increaseCount = 0;
    for(i = 1; i < depths.length; i++){
        if(depths[i] > depths[i - 1]) increaseCount++;
    }
    return increaseCount;
}

function sonarSweep2(lines){
    let depths = lines.map(Number)
    let sliding = [];
    for(i = 2; i < depths.length; i++){
        sliding =
            sliding.concat(depths[i - 2] + depths[i - 1] + depths[i]);
    }
    console.log(countIncreases(sliding));
}
