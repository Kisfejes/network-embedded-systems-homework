const mqtt = require('mqtt');
const fs = require('fs');
const os = require('os');
const path = require('path');
const makeDir = require('make-dir');

const config = require('../../config/config');
const getSerial = require('../utils/raspi-info');
const { fetchAPI } = require('../utils/utils');

const TOPIC_DEVICE_CONNECT = 'device/connect';

module.exports = async (connectId) => {
  const serial = getSerial();
  console.log('Serial', serial);
  console.log(`Connecting with: "${connectId}"`);
  // send http request
  const deviceData = await fetchAPI('devices', 'connect', {
    raspberryId: serial.toString(),
    UID: connectId.toString()
  });

  const mqttClient = mqtt.connect(`mqtt://${config.mqtt.hostname}:${config.mqtt.port}`);

  mqttClient.on('connect', () => {
    console.log(`Publishing to ${TOPIC_DEVICE_CONNECT}`);
    const objToPublish = {
      UID: connectId.toString()
    };
    mqttClient.publish(TOPIC_DEVICE_CONNECT, JSON.stringify(objToPublish), () => {
      // close client
      mqttClient.end();
    });
  });
  // write config file
  const homedir = os.homedir();
  const deviceConfigDir = path.join(homedir, '.rfid-access');
  await makeDir(deviceConfigDir);
  fs.writeFileSync(path.join(deviceConfigDir, 'device.json'), JSON.stringify(deviceData));
  console.log('Connection was successful!');
};
