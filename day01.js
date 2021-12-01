const fs = require('fs');

fs.readFile('day01.txt', 'utf-8', (err, data) => {
    if (err) throw err;
    sonarSweep1(data.trim().split('\n'));
});

function sonarSweep1(lines){
    let depths = lines.map(Number)
    let increaseCount = 0;
    for(i = 1; i < depths.length; i++){
        if(depths[i] > depths[i - 1]) increaseCount++;
    }
    console.log(increaseCount);
}
