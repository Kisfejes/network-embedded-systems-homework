const yargs = require('yargs');

yargs.usage('Usage: rfid-access <command> [options]') // eslint-disable-line
  .command({
    command: 'reset-db',
    aliases: ['rd'],
    desc: 'Reset database',
    handler: async () => {
      try {
        console.log('CLI: Reset database');
        const resetDBcommand = require('./commands/reset-db');
        await resetDBcommand();
      } catch (error) {
        console.log(error);
      }
    }
  })
  .demandCommand(1)
  .option('env', {
    desc: 'Specify run environment',
    default: 'dev'
  })
  .help()
  .epilog('RFID Access control system 2017')
  .argv;
