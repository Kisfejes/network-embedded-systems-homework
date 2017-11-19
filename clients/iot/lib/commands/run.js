const figlet = require('figlet');
const Agent = require('../Agent');

module.exports = async () => {
  console.log(figlet.textSync('Client running!', {
    font: 'Standard',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }));

  const agent = new Agent();
  agent.init();
};

