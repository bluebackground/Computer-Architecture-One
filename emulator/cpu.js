const fs = require('fs');

const {
  debug
} = require('./helpers.js');

const message1 = 'CPU: Instruction (%s):';
const message2 = 'CPU: Data:';

const REG_SIZE = 256;
const L1_CACHE_SIZE = 256;
const L2_CACHE_SIZE = 256;
const L3_CACHE_SIZE = 256;

// Basic CPU
const HALT = 0b00000000; // Halt CPU
const INIT = 0b00000001; // Initialize CPU registers to zero
const SET = 0b00000010; // SET R(egister)
const SAVE = 0b00000100; // SAVE I(mmediate)
const MUL = 0b00000101; // MUL R R
const PRN = 0b00000110; // Print numeric
const PRA = 0b00000111; // Print alpha char

// Load/Store Extension
// const LD = 0b00001000; // Load M(emory)
// const ST = 0b00001001; // Store M(emory)
// const LDRI = 0b00010010; // Load-Register-Indirect R

// Push/Pop Extension
// Uses register 255 as the stack pointer
// const PUSH = 0b00001010; // Push
// const POP = 0b00001011; // Pop

// Math Extension
const ADD = 0b00001100; // ADD R R
const SUB = 0b00001101; // SUB R R
const DIV = 0b00001110; // DIV R R

// Call/Return Extension
// const CALL = 0b00001111; // Call
// const RET = 0b00010000; // Return

// Compare/Branch Extension
// const JMP = 0b00010001; // JMP
// const JEQ = 0b00010011; // JEQ
// const JNE = 0b00010100; // JNE
// const CMP = 0b00010110; // CMP R

// Increment/Decrement Extension
const INC = 0b00010111; // INC
const DEC = 0b00011000; // DEC

// System-utilized general purpose registers
// const IS = 0xfd; // Interrupt status register
// const IM = 0xfe; // Interrupt mask register
// const SP = 0xff; // Stack pointer

class CPU {
  constructor(comp, speed) {
    // Computer machine
    this.computer = comp;

    // Base CPU stats
    this.HZ = speed;
    // this.TYPE = PROCESSOR_BIT_CAPACITY;
    // this.timerInterrupt = INTERVAL;

    // COMPUTER COMPONENT CONNECTIONS
    // Simulated Connections to other systems.
    this.controllers = {};

    // Address Registers &
    // Data Registers
    this.reg = {};

    this.reg.CAR = 0; // Current address Register
    this.reg.REG = new Array(REG_SIZE);

    this.reg.CDR = 0; // Current Data Register

    this.reg.MAR = 0; // Memory Address Register
    this.reg.MDR = 0; // Memory Data Register

    // Pointers (kind of like addresses) Registers
    // I'm not sure if I'll use PC; Might just user CAR.
    this.reg.PC = 0; // Program Counter Stored in a register;

    this.reg.L1_P = 0; // L1 Cache Pointer stored in a register;
    this.reg.L1_D = 0;

    // CACHE
    this.L1_CACHE = new Array(L1_CACHE_SIZE);
    this.L1_CACHE.fill(0);
    // this.L2_CACHE = new Array(256);
    // this.L3_CACHE = new Array(256);

    this._initializeDecoder();
  }

  startClock() {
    console.log('CPU: Starting clock');
    this.clock = setInterval(() => {
      this._tick();
    }, this.HZ);
  }

  stopClock() {
    console.log('CPU: Stopping clock');
    clearInterval(this.clock);
    // clearInterval(this.timerInterrupt);
    this.computer.stop();
  }

  setClock() {

    // this.timerInterrupt = setInterval(() => {
    // Set the timer bit in the IS register
    //   cpu.reg[IS] |= INT_TIMER_MASK;
    // }, 1000);
  }

  addController(name, controller) {
    this.controllers[name] = controller;
  }

  // Essentially just the run current command on the stack.
  _tick() {
    console.log('CPU: --- CLOCK TICK ---');
    // Read the first thing in memory
    // Decode the byte value.

    // Set the MDR using the MAR (default = 0);
    // this.controllers.MC.access(this.reg.PC, null, false);

    // Simulate the transfer of info
    // from MDR to CDR;
    // this._MDRtoCDR();
    this._pull();

    // Decode the byte value in CDR.
    this._decode();

    // Summary:
    // Use the CAR to access the Address in memory
    // Get set the MAR and MDR based on that.
    // Push the MDR data to the CDR
  }

  _decode() {

    const byteValue = this.reg.CDR;
    const handler = this.decoder[byteValue];

    if (handler === undefined) {
      console.log('CPU: ERROR - Invalid Instruction - ' + byteValue);

      this.stopClock();
      console.log('COMPUTER: Blue Screen of Death');
      this.computer.stop();
      return;
    }

    // Run the command associated with the Byte Value;
    handler.call(this);
  }

  _pull() {
    this.controllers.MC.access(this.reg.PC, null, false);
    this._MDRtoCDR();
    this._incPC();
  }

  _poke(address, value) {
    this.controllers.MC.access(address, value, true);
  }

  _MDRtoCDR() {
    this.reg.CDR = this.reg.MDR;
  }

  _incPC() {
    this.reg.PC += 1;
  }

  _decPC() {
    this.reg.PC -= 1;
  }

  _setPC(val) {
    this.reg.PC = val;
  }

  // _alu() {
  //
  // }

  _initializeDecoder() {
    //Branch Table
    let bt = {};

    bt[HALT] = this.HALT;
    bt[INIT] = this.INIT;
    bt[SET] = this.SET;
    bt[SAVE] = this.SAVE;
    bt[MUL] = this.MUL;
    bt[PRN] = this.PRN;
    bt[PRA] = this.PRA;
    // bt[LD] = this.LD;
    // bt[ST] = this.ST;
    // bt[LDRI] = this.LDRI;
    // bt[PUSH] = this.PUSH;
    // bt[POP] = this.POP;
    bt[ADD] = this.ADD;
    bt[SUB] = this.SUB;
    bt[DIV] = this.DIV;
    // bt[CALL] = this.CALL;
    // bt[RET] = this.RET;
    // bt[JMP] = this.JMP;
    // bt[JEQ] = this.JEQ;
    // bt[JNE] = this.JNE;
    // bt[CMP] = this.CMP;
    bt[INC] = this.INC;
    bt[DEC] = this.DEC;
    // bt[INT] = this.INT;
    // bt[IRET] = this.IRET;

    this.decoder = bt;
  }

  _resetRegisters() {
    // Address Registers &
    // Data Registers
    // this.reg.CAR = 0; // Current address Register
    // this.reg.CDR = 0; // Current Instruction Register

    // this.reg.MAR = 0; // Memory Address Register
    // this.reg.MDR = 0; // Memory Data Register

    // Pointers (kind of like addresses) Registers
    // this.reg.PC = 0; // Program Counter Stored in a register;

    // this.reg.L1_P = 0; // L1 Cache Pointer stored in a register;
  }

  HALT() {
    console.log(message1, 'HALT', this.reg.CDR);
    this.stopClock();
  }

  INIT() {
    console.log(message1, 'INIT', this.reg.CDR);

    // this._resetRegisters();

    // Do some initialization to indicate the start of a program.
  }

  // Sets the CAR to the location that you want to save data to in REG
  SET() {
    console.log(message1, 'SET', this.reg.CDR);
    this._pull();
    this.reg.CAR = this.reg.CDR;
    console.log(message2, this.reg.CDR);
  }

  SAVE() {
    console.log(message1, 'SAVE', this.reg.CDR);
    this._pull();
    this.reg.REG[this.reg.CAR] = this.reg.CDR;
    console.log(message2, this.reg.CDR);
  }

  MUL() {
    console.log(message1, 'MULT', this.reg.CDR);
    this._pull();
    const regAddress1 = this.reg.CDR;
    this._pull();
    const regAddress2 = this.reg.CDR;

    this.reg.REG[this.reg.CAR] = this.reg.REG[regAddress1] * this.reg.REG[regAddress2] & 255;
  }

  PRN() {
    console.log(message1, 'PRN', this.reg.CDR);
    console.log('DISPLAY: Showing (%s)', this.reg.REG[this.reg.CAR]);
  }

  ADD() {
    console.log(message1, 'ADD', this.reg.CDR);
    this._pull();
    const regAddress1 = this.reg.CDR;
    this._pull();
    const regAddress2 = this.reg.CDR;

    this.reg.REG[this.reg.CAR] = this.reg.REG[regAddress1] + this.reg.REG[regAddress2] & 255;
  }

  SUB() {
    console.log(message1, 'SUB', this.reg.CDR);
    this._pull();
    const regAddress1 = this.reg.CDR;
    this._pull();
    const regAddress2 = this.reg.CDR;

    this.reg.REG[this.reg.CAR] = this.reg.REG[regAddress1] - this.reg.REG[regAddress2] & 255;
  }

  DIV() {
    console.log(message1, 'DIV', this.reg.CDR);
    this._pull();
    const regAddress1 = this.reg.CDR;
    this._pull();
    const regAddress2 = this.reg.CDR;
    const val2 = this.reg.REG[regAddress2];

    if (val2 === 0) {
      this.HALT();
      return;
    }
    this.reg.REG[this.reg.CAR] = this.reg.REG[regAddress1] / val2 & 255;
  }

  INC() {
    console.log(message1, 'INC', this.reg.CDR);
    this._pull();
    const regAddress1 = this.reg.CDR;

    this.reg.REG[regAddress1] = (this.reg.REG[regAddress1] + 1) & 255;
  }

  DEC() {
    console.log(message1, 'DEC', this.reg.CDR);
    this._pull();
    const regAddress1 = this.reg.CDR;

    this.reg.REG[regAddress1] = (this.reg.REG[regAddress1] - 1) & 255;
  }
}


// alu(func, reg0, reg1) {
//   let regVal0, regVal1;
//
//   switch (func) {
//   case 'MUL':
//     regVal0 = this.reg[reg0];
//     regVal1 = this.reg[reg1];
//
//     return regVal0 * regVal1;
//   case 'ADD':
//     regVal0 = this.reg[reg0];
//     regVal1 = this.reg[reg1];
//
//     return regVal0 + regVal1;
//   case 'INC':
//     this.reg[reg0]++;
//
//     if (this.reg[reg0] > 255) {
//       this.reg[reg0] = 0;
//     }
//     break;
//   case :'DEC':
//     this.reg[reg0]--;
//
//     if (this.reg[reg0] < 0) {
//       this.reg[reg0] = 255;
//     }
//
//     break;
//   }
// }
//
//
// ADD() {
//   const reg0 =
// }
//
// PUSH() {
//   console.log('PUSH');
//   // decrement sp
//   this.alu('DEC', SP);
//   this.mem[this.reg[SP]] = this.reg[this.curReg];
// }
//
// POP() {
//   console.log('POP');
//   this.mem[this.reg[SP]] = this.reg[this.curReg];
//   this.alu('INC', SP);
// }
//
// // load
//
// LD() {
//   console.log('LD');
//
//   const address = this.mem[this.reg.PC + 1];
//
//   // this.reg.MAR = this.reg.PC +1;
//   // loadMem();
//   // const address = this.reg.MDR;
//
//   // this. reg.MAR = address;
//   // loadMem();
//   // this.reg[this.curReg] = this.reg.MAR;
//
//   this.reg[this.curReg] = this.mem[address];
//
//   this.alu('INC', 'PC');
//   this.alu('INC', 'PC');
// }
//
// SD() {
//   console.log('SD');
//   const address = this.mem[this.reg.PC + 1];
//
//   this.mem[address] = this.reg[this.curReg];
//
//   this.alu('INC', 'PC');
//   this.alu('INC', 'PC');
// }
//
// JMP() {
//
//   // 00010001 JMP // Jump to
//   // 00001110 // address 14
//
//   this.reg.MAR = this.reg.PC + 1;
//
//   loadMem();
//
//   this.reg.PC = this.reg.MDR;
// }

module.exports = CPU;
