const { readFileSync } = require('fs');
const path = require('path');
const argv = require('yargs').argv;

const env = process.env.NODE_ENV || argv.env;
if (!env) {
  throw new Error('Please specify the NODE_ENV environment variable!');
}

const defaultConfig = {
  api: {
    baseUrl: process.env.API_URL || 'http://localhost:7070'
  },
  mqtt: {
    hostname: process.env.MQTT_SERVER || 'localhost',
    port: 1883
  }
};
let specConfig = {};
try {
  const specConfigPath = path.join(__dirname, `./config.${env}.json`);
  const specConfigFile = readFileSync(specConfigPath);
  specConfig = JSON.parse(specConfigFile.toString());
  console.log(`Config file(${path.basename(specConfigPath)}) loaded`);
} catch (err) {
  console.log(`Can not read specific config file: ${err}`);
  console.log('Fallback to default config!');
}

const config = Object.assign({}, defaultConfig, specConfig);

module.exports = config;
