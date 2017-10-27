const mosca = require('mosca');

const ascoltatore = {
  // using ascoltatore
  type: 'mongo',
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

const settings = {
  port: 1883,
  backend: ascoltatore,
  http: {
    port: 3300,
  }
};

const server = new mosca.Server(settings);

server.on('clientConnected', (client) => {
  console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', (packet, client) => {
  console.log('Published');
  // console.log(packet.payload);
  console.log(packet.payload.toString());
});

server.on('ready', () => {
  console.log(`Mosca server is up and running on mqtt://localhost:${settings.port}`);
});
