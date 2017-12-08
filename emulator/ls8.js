const fs = require('fs');
const CPU = require('./cpu');

/**
#inputfile
00000001 # initialize
00000010 # SET register
00000000 # register #0
00000100 # SAVE next
00001000 # 8
00000010 # SET register
00000001 # register #1
00000100 # SAVE next
00001001 # 9
00000010 # SET register
00000010 # register #2
00000101 # MUL into last
00000000 # register #0
00000001 # register #1
00000010 # SET register
00000010 # register #2
00000110 # PRINT_NUMERIC
00000000 # HALT
*/

function readFile(filename) {
  const contents = fs.readFileSync(filename, 'utf-8');
  return contents;
}

function loadMemory(cpu, contents) {
  const lines = contents.split('\n');

  let cleanLines = lines.map((line) => {
    const commentIndex = line.indexOf('#');
    if (commentIndex !== -1) {
      return line.substr(0, commentIndex).trim();
    }
    return line.trim();
  });

  cleanLines = cleanLines.filter((line) => {
    return line.length > 0;
  });

  cleanLines = cleanLines.map((command) => {
    return parseInt(command, 2);
  });

  // console.log(cleanLines);
  // return cleanLines;

  // put the commands into cpu memory

  cleanLines.forEach((line, index) => {
    cpu.poke(index, line);
  });

}


function main() {

  const cpu = new CPU();

  const args = process.argv.slice(2);

  if (args.length != 1) {
    console.error("usage: ls8 infile");
    process.exit(1);
  }

  const filename = args[0];
  const contents = readFile(filename);

  loadMemory(cpu, contents);
}

main();



/**
 * Process a loaded file
 */
function processFile(content, cpu, onComplete) {
  // Pointer to the memory address in the CPU that we're
  // loading a value into:
  let curAddr = 0;

  // Split the lines of the content up by newline
  const lines = content.split('\n');

  // Loop through each line of machine code

  for (let line of lines) {
    // Hunt for a comment
    const commentIndex = line.indexOf('#');

    // If we found one, cut off everything after
    if (commentIndex != -1) {
      line = line.substr(0, commentIndex);
    }

    // Remove whitespace from either end
    line = line.trim();

    if (line === '') {
      // Line was blank or only a comment
      continue;
    }

    // At this point, the line should just be the 1s and 0s

    // Convert from binary string to number
    const binValue = parseInt(line, 2); // Base 2 == binary

    // Check to see if the parsing failed
    if (isNaN(binValue)) {
      console.error('Invalid binary number: ' + line);
      process.exit(1);
    }

    // Ok, we have a good value, so store it into memory:
    //console.log(`storing ${binValue}, ${line}`);
    cpu.poke(curAddr, binValue);

    // And on to the next one
    curAddr++;
  }

  onComplete(cpu);
}

/**
 * Load the instructions into the CPU from stdin
 */
function loadFileFromStdin(cpu, onComplete) {
  let content = '';

  // Read everything from standard input, stolen from:
  // https://stackoverflow.com/questions/13410960/how-to-read-an-entire-text-stream-in-node-js
  process.stdin.resume();
  process.stdin.on('data', function (buf) {
    content += buf.toString();
  });
  process.stdin.on('end', () => {
    processFile(content, cpu, onComplete);
  });
}

/**
 * Load the instructions into the CPU from a file
 */
function loadFile(filename, cpu, onComplete) {
  const content = fs.readFileSync(filename, 'utf-8');
  processFile(content, cpu, onComplete);
}

/**
 * On File Loaded
 *
 * CPU is set up, start it running
 */
function onFileLoaded(cpu) {
  cpu.startClock();
}

/**
 * Main
 */

// let cpu = new CPU();

// Get remaining command line arguments
// const argv = process.argv.slice(2);

/* Check arguments
if (argv.length === 0) {
  // Read from stdin
  loadFileFromStdin(cpu, onFileLoaded);
} else if (argv.length == 1) {
  // Read from file
  loadFile(argv[0], cpu, onFileLoaded);
} else {
  console.error('usage: ls8 [machinecodefile]');
  process.exit(1);

}
*/
