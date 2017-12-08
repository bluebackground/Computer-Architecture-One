class MemoryController {
  constructor(cpu, ram) {
    this.CPU = cpu;
    this.RAM = ram;
  }

  access(address, value, writeBool) {
    this._setMemRegisters(address, value);

    if (writeBool) {
      this._write();
    } else {
      this._read();
    }
  }

  _setMemRegisters(address, value) {
    this.CPU.reg.MAR = address;
    this.CPU.reg.MDR = value;
  }

  _read() {
    // console.log("MEM CONTRLR: Reading RAM address (%s)", address);

    // set the Memory Address Register
    this.CPU.reg.MDR = this.RAM.get(this.CPU.reg.MAR);
  }

  _write() {
    this.RAM.set(this.CPU.reg.MAR, this.CPU.reg.MDR);
    // if (this.CPU.MAR > MEMORY_SIZE) {
    //   return;
    // }
    // console.log("MEM CONTRLR: Writing to RAM address (%s)", this.CPU.reg.CAR, this.CPU.reg.MDR);
    // this.RAM.memory[this.CPU.reg.MAR] = this.CPU.reg.MDR;
  }

  // Depricated
  readFromCAR() {
    // console.log("MEM CONTR: Reading RAM address (%s)", this.CPU.reg.CAR);
    this.CPU.reg.MAR = this.CPU.reg.CAR;
    this.read();
  }






}

module.exports = MemoryController;
