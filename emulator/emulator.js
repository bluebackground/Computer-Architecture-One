const fs = require('fs');
const CPU = require('./cpu.js');
const RAM = require('./ram.js');
const MemoryController = require('./memoryController.js');
// const PeripheralsController = require('./peripheralsController')
// const Keyboard = require('./keyboard.js');

const {
  MEMORY_SIZE,
  PROCESSOR_BIT_CAPACITY,
  CLOCK_SPEED,
  INTERVAL
} = require('./variables.js');

class Computer {
  constructor() {
    console.log("NODE: Initializing virtual CPU...");
    this.CPU = new CPU(this, CLOCK_SPEED);

    console.log("NODE: Initializing virtual RAM...");
    this.RAM = new RAM(MEMORY_SIZE);

    console.log("NODE: Initializing virtual Memory Controller...");
    this.MC = new MemoryController(this.CPU, this.RAM);
    this.CPU.addController('MC', this.MC);
    // this.PC = new PeripheralsController(CPU);
    // this.PC.addPeripheral(new Keyboard());
    // this.CPU.addController('PC', this.PC);
  }

  start() {
    this._boot();
  }

  stop() {
    this._shutdown();
  }

  _boot() {
    console.log("COMPUTER: Booting up...");
    this.CPU.startClock();
  }

  _shutdown() {
    console.log("COMPUTER: Shutting down...");
  }

  addPeripheral(p) {
    this.peripherals.push(p);
  }

  loadFileToRam(path) {
    this.RAM.loadDataFromFile(path);
  }
}

module.exports = Computer;
