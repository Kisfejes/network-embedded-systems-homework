const pn532 = require('pn532');
const SerialPort = require('serialport');
const fs = require('fs');
const os = require('os');
const path = require('path');
const Gpio = require('onoff').Gpio;

class Agent {
  constructor() {
    console.log('Open serialport');
    this.serialPort = new SerialPort('/dev/serial0', { baudRate: 115200 });
    this.relay = new Gpio(23, 'out');

    this.allowedRfids = [];
    this.closeTimeout = null;
  }

  onTag(tag) {
    console.log('tag:', tag.uid);
    if (this.allowedRfids.includes(tag.uid)) {
      // open the relay
      this.relay.writeSync(1);
      this.openInProgress = true;
      // close the relay after 5 sec
      if (this.closeTimeout) {
        clearTimeout(this.closeTimeout);
      }
      this.closeTimeout = setTimeout(() => {
        this.relay.writeSync(0);
        this.openInProgress = false;
      }, 5000);
    }
  }

  async init() {
    try {
      // read config

      // read access config
      const homedir = os.homedir();
      const deviceConfigDir = path.join(homedir, '.rfid-access');
      const accessConfig = fs.readFileSync(path.join(deviceConfigDir, 'access.json'));
      const accessConfigObj = JSON.parse(accessConfig.toString());
      console.log(accessConfigObj);
      this.allowedRfids = accessConfigObj.allowedRfids;

      console.log('Open pn532');
      this.rfid = new pn532.PN532(this.serialPort);
      this.rfid.on('ready', async () => {
        console.log('pn532 ready');
        const firmwareData = await this.rfid.getFirmwareVersion();
        console.log(firmwareData);
        this.rfid.on('tag', this.onTag.bind(this));
      });
    } catch (err) {
      console.log('Agent init failed');
      console.log(err);
      process.exit();
    }
  }
}

module.exports = Agent;
