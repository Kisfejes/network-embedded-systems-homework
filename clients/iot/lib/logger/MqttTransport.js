const Transport = require('winston-transport');

class MqttTransport extends Transport {
  constructor(options) {
    super();
    const { client, deviceUID } = options;
    this.name = 'mqtt';
    this.deviceUID = deviceUID;
    this.level = options.level || 'debug';
    this.client = client;
  }

  close() {
    if (this.client) {
      this.client.end();
    }
  }

  log(info, callback) {
    const message = {
      level: info.level,
      meta: info.meta,
      deviceUID: this.deviceUID,
      msg: info.msg,
      transport: 'mqtt'
    };
    const logTopic = `device/log/${this.deviceUID}`;
    this.client.publish(logTopic, JSON.stringify(message));
    callback(null, true);
  }
}

module.exports = MqttTransport;
