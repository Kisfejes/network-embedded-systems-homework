const winston = require('winston');
const MqttTransport = require('./MqttTransport');

const { combine, timestamp, label, printf, colorize } = winston.format;

const myFormat = printf(info => `${info.timestamp} ${info.level}: ${info.message}`);

const customLevels = {
  levels: {
    verbose: 8,
    debug: 7,
    info: 6,
    warn: 4,
    error: 3,
    fatal: 2,
  },
  colors: {
    verbose: 'yellow',
    debug: 'gray',
    info: 'cyan',
    warning: 'orange',
    error: 'red',
    fatal: 'red'
  },
};

const logger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new (winston.transports.Console)({
      level: 'debug',
      format: combine(
        colorize(),
        timestamp(),
        myFormat
      ),
    }),
    new (winston.transports.File)({
      filename: 'rfid-access.log',
      level: 'debug',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false
    })
  ]
});

winston.addColors(customLevels);

logger.info('logger ok');

function addMQTTTransport(client, deviceUID, level) {
  logger.add(new MqttTransport({ client, deviceUID, level }));
  logger.debug(`MQTT log transporter added with "${level}" level`);
}

module.exports = {
  logger,
  addMQTTTransport
};
