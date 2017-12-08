const fs = require('fs');

const {
  MEMORY_SIZE
} = require('./variables.js');

class RAM {
  constructor(size) {
    this.memory = new Array(size);
    this.memory.fill(0);

    // Pointers
    // this.PC = 0;
    // this.SC = 0;
  }

  set(address, value) {
    if (address < this.memory.length) {
      console.log('RAM: Setting %s to value %s', address, value);
      this.memory[address] = value;
    } else {
      console.log('RAM: Error - Cannot write to that address index out of bounds');
    }
  }

  get(address) {
    console.log('RAM: Getting value from %s', address);
    return this.memory[address];
  }

  /**
   * This method is simply to read the file into the RAM.
   * Not meant to reflect the reality of how memory is actually loaded.
   */

  loadDataFromFile(path) {
    const fileContents = readFile(path);

    console.log("NODE: Parsing file...");
    const lines = fileContents.split('\n');

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

    if (cleanLines.length > MEMORY_SIZE) {
      console.log('ERROR: Cannot load file to RAM');
    } else {
      cleanLines = cleanLines.map((line) => {
        return parseInt(line, 2);
      });
    }

    cleanLines.forEach((line, index) => {
      this.memory[index] = line;
    });

    console.log("NODE: File data added to virtual RAM");
  }
}

function readFile(filename) {
  console.log("NODE: (fs) Reading " + filename);
  const contents = fs.readFileSync(filename, 'utf-8');
  return contents;
}

module.exports = RAM;
