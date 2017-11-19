const { execSync } = require('child_process');

try {
  if (!process.argv[2]) {
    throw new Error('Please specify target ip address!');
  }

  const targetIPAddress = process.argv[2];
  console.log(`Sending client via ssh to: ${targetIPAddress}`);

  console.log('Zipping files');
  const stdOutZip = execSync('tar --exclude ./node_modules --exclude ./*.tar -zcvf rfid-access.tar ./*');
  console.log(stdOutZip.toString());

  console.log('Sending via SSH');
  execSync(`scp rfid-access.tar pi@${targetIPAddress}:/home/pi`);
} catch (err) {
  console.log(err.message);
}

