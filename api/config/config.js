const { readFileSync } = require('fs');
const path = require('path');

const env = process.env.NODE_ENV;
if (!env) {
  throw new Error('Please specify the NODE_ENV environment variable!');
}

const defaultConfig = {
  db: {
    host: 'localhost',
    port: 5432,
    database: 'rfid_access',
    username: 'postgres',
    password: 'devpass'
  },
  api: {
    port: 7070
  },
  cors: {
    whitelist: ['http://localhost:8080']
  },
  env
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
