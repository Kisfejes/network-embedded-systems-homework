const figlet = require('figlet');
const Agent = require('../Agent');

module.exports = async () => {
  console.log(figlet.textSync('RFID-Access system', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }));

  const agent = new Agent();
  agent.init();
};

