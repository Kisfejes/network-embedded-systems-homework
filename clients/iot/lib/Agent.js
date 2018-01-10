const pn532 = require('pn532');
const SerialPort = require('serialport');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { Gpio } = require('onoff');
const mqtt = require('mqtt');

const config = require('../config/config');
const { fetchAPI } = require('./utils/utils');
const { logger, addMQTTTransport } = require('./logger');

class Agent {
  constructor() {
    logger.info('Creating Agent');

    this.relay = new Gpio(23, 'out');
    this.allowedRfids = [];
    this.relayCloseTimeout = null;
    this.mqttClient = null;
  }

  async updateAccessConfig() {
    // try to update access-config
    let allowedRfids = null;
    try {
      const accessConfig = await fetchAPI('devices', 'getAccessConfig', this.deviceConfig.UID);
      allowedRfids = accessConfig.rfids;
      fs.writeFileSync(path.join(this.deviceConfigDir, 'access.json'), JSON.stringify({
        allowedRfids
      }));
    } catch (err) {
      logger.warn(err);
      logger.warn('Fallback to access-config stored in SD card');
      // read access config
      const accessConfig = fs.readFileSync(path.join(this.deviceConfigDir, 'access.json'));
      const accessConfigObj = JSON.parse(accessConfig.toString());
      allowedRfids = accessConfigObj.allowedRfids; // eslint-disable-line
    }
    logger.debug(`allowed rfids: ${allowedRfids}`);
    this.allowedRfids = allowedRfids;
  }

  onTag(tag) {
    logger.debug(`tag: ${tag.uid}`);
    if (this.mqttClientReady) {
      const topic = `device/read-tag/${this.deviceConfig.UID}`;
      const msg = { UID: tag.uid };
      this.mqttClient.publish(topic, JSON.stringify(msg));
    }

    const allowedCard = this.allowedRfids.includes(tag.uid);

    // we are not waiting http response for purpose
    fetchAPI('accesslogs', 'create', {
      deviceUID: this.deviceConfig.UID,
      rfidID: tag.uid,
      accessDate: new Date(),
      access: allowedCard
    });

    if (allowedCard) {
      // open the relay
      this.relay.writeSync(1);
      this.openInProgress = true;
      // close the relay after 5 sec
      if (this.relayCloseTimeout) {
        clearTimeout(this.relayCloseTimeout);
      }
      this.relayCloseTimeout = setTimeout(() => {
        this.relay.writeSync(0);
        this.openInProgress = false;
      }, 5000);
    }
  }

  initMqttClient() {
    return new Promise((resolve, reject) => {
      logger.debug(`Connecting to MQTT client: mqtt://${config.mqtt.hostname}:${config.mqtt.port}`);
      this.mqttClient = mqtt.connect(`mqtt://${config.mqtt.hostname}:${config.mqtt.port}`);

      // Reject if not connected after 5 sec
      const rejectTimeout = setTimeout(() => reject(), 5000);

      this.mqttClientReady = false;
      this.mqttClient.on('connect', () => {
        clearTimeout(rejectTimeout);
        logger.info('MQTT client connected');

        const accessConfigUpdateTopic = `device/service/update-access-config/${this.deviceConfig.UID}`;
        this.mqttClient.subscribe(accessConfigUpdateTopic, () => {
          logger.debug(`Subscribed to ${accessConfigUpdateTopic}`);

          this.mqttClient.on('message', async (topic) => {
            if (topic === accessConfigUpdateTopic) {
              logger.info('Updating access config');
              await this.updateAccessConfig();
              logger.info('Access config updated!');
            }
          });
        });

        this.mqttClientReady = true;
        return resolve();
      });
    });
  }

  initRfidReader() {
    return new Promise((resolve, reject) => {
      logger.debug('Open RFID reader');
      this.rfid = new pn532.PN532(this.serialPort);

      // Reject if not connected after 5 sec
      const rejectTimeout = setTimeout(() => reject(), 5000);

      this.rfid.on('ready', async () => {
        clearTimeout(rejectTimeout);
        logger.info('RFID reader ready');
        const firmwareData = await this.rfid.getFirmwareVersion();
        logger.debug(JSON.stringify(firmwareData));
        this.rfid.on('tag', this.onTag.bind(this));
        resolve();
      });
    });
  }

  async init() {
    try {
      logger.info('Initializing Agent');

      const homedir = os.homedir();
      this.deviceConfigDir = path.join(homedir, '.rfid-access');
      // read config
      const deviceConfig = fs.readFileSync(path.join(this.deviceConfigDir, 'device.json'));
      this.deviceConfig = JSON.parse(deviceConfig.toString());
      logger.info(`Starting "${this.deviceConfig.name} with UID "${this.deviceConfig.UID}"`);

      await this.updateAccessConfig();

      try {
        await this.initMqttClient();
        addMQTTTransport(this.mqttClient, this.deviceConfig.UID, 'debug');
      } catch (err) {
        console.log(err);
        logger.warn(err.message);
        logger.warn('Could not create mqtt client');
      }

      logger.debug('Open serialport');
      this.serialPort = new SerialPort('/dev/serial0', { baudRate: 115200 });
      await this.initRfidReader();
      logger.info('Agent initialization succeed');
    } catch (err) {
      logger.error(err.message);
      console.log(err);
      logger.error('Agent initialization failed');
      if (this.mqttClient) {
        this.mqttClient.end();
      }
      process.exit(1);
    }
  }
}

module.exports = Agent;
