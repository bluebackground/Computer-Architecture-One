const program = require('commander');
const Computer = require('./emulator.js');

// const MyComp = new Computer();

const {
  MEMORY_SIZE,
  PROCESSOR_BIT_CAPACITY,
  CLOCK_SPEED,
  INTERVAL
} = require('./variables');

program
  .version('0.0.1')
  .description('Computer Emulator');

// program
//   .command('load <dir>')
//   .alias('l')
//   .description('Load a local file to RAM sub system memory')
//   .action((dir) => {
//     MyComp.RAM.loadFile(dir);
//   });

program
  .command('start')
  .description('Start the computer emulator')
  .option("-l, --load_file <dir> [otherDirs...]", "Load file to RAM")
  .action((options) => {

    console.log("NODE: Config Info Memory Size (%s)", MEMORY_SIZE);
    console.log("NODE: Config Info Clock Speed (%s)", CLOCK_SPEED);

    console.log("NODE: Starting Emulator...");
    console.log("NODE: Initializing a new computer instance...");

    const MyComp = new Computer();

    console.log("NODE: Loading path to virtual RAM...");
    MyComp.loadFileToRam(options.load_file);

    MyComp.start();
  });

program.parse(process.argv);
