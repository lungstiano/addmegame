
const program = require('commander');
const fs = require('fs');

program
.option('-i, --in <file>', 'Input file')
 .option('-o, --out <file>', 'Output file')
 .parse(process.argv);
 
 const { in: inFile, out: outFile } = program.opts();
    if (!inFile || !outFile) {
        console.error('Error: Both input and output files are required');
        program.help();
    }
    
    fs.readFile(inFile, 'utf8', (err, data) => {
        if (err) throw err;
        console.log({output: data}) 
        fs.writeFile(outFile, outputData, 'utf8', (err) => {
            if (err) throw err;
            console.log(`Output file saved to ${outFile}`);
 });
});

