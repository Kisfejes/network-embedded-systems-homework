const yargs = require('yargs');

yargs.usage('Usage: rfid-access <command> [options]') // eslint-disable-line
  .command({
    command: 'connect',
    aliases: ['conn'],
    desc: 'Connect device to the server',
    builder: () => yargs
      .option('connectId', {
        alias: 'cid'
      })
      .demandOption('connectId'),
    handler: async (argv) => {
      try {
        const connectCommand = require('../lib/commands/connect');
        await connectCommand(argv.connectId);
      } catch (error) {
        console.log(error);
      }
    }
  })
  .command({
    command: 'run',
    desc: 'Run IoT Client',
    handler: async () => {
      try {
        const runCommand = require('../lib/commands/run');
        await runCommand();
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
