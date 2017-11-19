const fs = require('fs');

const { getRandomNumber } = require('./utils.js');

function getSerial() {
  try {
    const lines = fs.readFileSync('/proc/cpuinfo').toString().split('\n');
    for (const line in lines) { // eslint-disable-line
      const parts = lines[line].replace(/\t/g, '').split(':');
      if (parts[0] === 'Serial') {
        return parts[1].trim();
      }
    }
  } catch (err) {
    const dummySerial = `${getRandomNumber(0, 9)}${getRandomNumber(0, 9)}${getRandomNumber(0, 9)}#############`;
    console.log(`Device has no serial number, using dummy serial "${dummySerial}"`);
    return dummySerial;
  }
  return 'N/A';
}

module.exports = getSerial;
