const fs = require('fs');

// Basic CPU
const HALT = 0b00000000; // Halt CPU
const INIT = 0b00000001; // Initialize CPU registers to zero
const SET = 0b00000010; // SET R(egister)
const SAVE = 0b00000100; // SAVE I(mmediate)
const MUL = 0b00000101; // MUL R R
const PRN = 0b00000110; // Print numeric
const PRA = 0b00000111; // Print alpha char

// Load/Store Extension
const LD = 0b00001000; // Load M(emory)
const ST = 0b00001001; // Store M(emory)
const LDRI = 0b00010010; // Load-Register-Indirect R

// Push/Pop Extension
// Uses register 255 as the stack pointer
const PUSH = 0b00001010; // Push
const POP = 0b00001011; // Pop

// Math Extension
const ADD = 0b00001100; // ADD R R
const SUB = 0b00001101; // SUB R R
const DIV = 0b00001110; // DIV R R

// Call/Return Extension
const CALL = 0b00001111; // Call
const RET = 0b00010000; // Return

// Compare/Branch Extension
const JMP = 0b00010001; // JMP
const JEQ = 0b00010011; // JEQ
const JNE = 0b00010100; // JNE
const CMP = 0b00010110; // CMP R

// Increment/Decrement Extension
const INC = 0b00010111; // INC
const DEC = 0b00011000; // DEC

// System-utilized general purpose registers
const IS = 0xfd; // Interrupt status register
const IM = 0xfe; // Interrupt mask register
const SP = 0xff; // Stack pointer

class CPU {
  constructor() {
    // Registers
    this.CR = 0; // Current Register
    this.IR = 0; // Instruction Register
    this.MAR = 0; // Memory Address Register
    this.MDR = 0; // Memory Data Register

    // General Purpose register
    this.reg = new Array(256);
    this.reg.fill(0);

    // Pointers
    this.reg.PC = 0;
    this.reg[SP] = 0;

    this.buildBranchTable();
  }

  poke(address, value) {
    this.mem[address] = value;
  }

  buildBranchTable() {
    let bt = {};

    bt[HALT] = this.HALT;
    bt[INIT] = this.INIT;
    bt[SET] = this.SET;
    bt[SAVE] = this.SAVE;
    bt[MUL] = this.MUL;
    bt[PRN] = this.PRN;
    bt[PRA] = this.PRA;
    bt[LD] = this.LD;
    bt[ST] = this.ST;
    bt[LDRI] = this.LDRI;
    bt[PUSH] = this.PUSH;
    bt[POP] = this.POP;
    bt[ADD] = this.ADD;
    bt[SUB] = this.SUB;
    bt[DIV] = this.DIV;
    bt[CALL] = this.CALL;
    bt[RET] = this.RET;
    bt[JMP] = this.JMP;
    bt[JEQ] = this.JEQ;
    bt[JNE] = this.JNE;
    bt[CMP] = this.CMP;
    bt[INC] = this.INC;
    bt[DEC] = this.DEC;
    bt[INT] = this.INT;
    bt[IRET] = this.IRET;

    this.branchTable = bt;
  }

  /**
   * Starts the clock ticking on the CPU
   */
  startClock() {
    const _this = this;

    this.clock = setInterval(() => {
      _this.tick();
    }, 1);

    this.timerInterrupt = setInterval(() => {
      // Set the timer bit in the IS register
      _this.reg[IS] |= INT_TIMER_MASK;
    }, 1000);
  }

  /**
   * Stops the clock
   */
  stopClock() {
    clearInterval(this.clock);
    clearInterval(this.timerInterrupt);
  }

  tick() {
    this.reg.MAR = this.reg.PC;
    this.loadMem();
    const currentInstruction = this.reg.MDR;

    const handler = this.branchTable[currentInstruction];

    if (handler === ) {

    }


  }

}






/**
 * Store in mem location MAR the value MDR
 */
storeMem() {
  this.mem[this.reg.MAR] = this.reg.MDR;
}

/**
 * Load from memory into MDR from MAR
 */
loadMem(address) {
  this.reg.MDR = this.mem[this.reg.MAR];
}



alu(func, reg0, reg1) {
  let regVal0, regVal1;

  switch (func) {
  case 'MUL':
    regVal0 = this.reg[reg0];
    regVal1 = this.reg[reg1];

    return regVal0 * regVal1;
  case 'ADD':
    regVal0 = this.reg[reg0];
    regVal1 = this.reg[reg1];

    return regVal0 + regVal1;
  case 'INC':
    this.reg[reg0]++;

    if (this.reg[reg0] > 255) {
      this.reg[reg0] = 0;
    }
    break;
  case :'DEC':
    this.reg[reg0]--;

    if (this.reg[reg0] < 0) {
      this.reg[reg0] = 255;
    }

    break;
  }
}


ADD() {
  const reg0 =
}

PUSH() {
  console.log('PUSH');
  // decrement sp
  this.alu('DEC', SP);
  this.mem[this.reg[SP]] = this.reg[this.curReg];
}

POP() {
  console.log('POP');
  this.mem[this.reg[SP]] = this.reg[this.curReg];
  this.alu('INC', SP);
}

// load

LD() {
  console.log('LD');

  const address = this.mem[this.reg.PC + 1];

  // this.reg.MAR = this.reg.PC +1;
  // loadMem();
  // const address = this.reg.MDR;

  // this. reg.MAR = address;
  // loadMem();
  // this.reg[this.curReg] = this.reg.MAR;

  this.reg[this.curReg] = this.mem[address];

  this.alu('INC', 'PC');
  this.alu('INC', 'PC');
}

SD() {
  console.log('SD');
  const address = this.mem[this.reg.PC + 1];

  this.mem[address] = this.reg[this.curReg];

  this.alu('INC', 'PC');
  this.alu('INC', 'PC');
}

JMP() {

  // 00010001 JMP // Jump to
  // 00001110 // address 14

  this.reg.MAR = this.reg.PC + 1;

  loadMem();

  this.reg.PC = this.reg.MDR;
}

module.exports = CPU;
