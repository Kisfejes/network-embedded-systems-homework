const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const config = require('./config/config');
const { initDB } = require('./db/db');

const endpoints = require('./endpoints');

async function main() {
  try {
    await initDB();
    console.log('Db initializing succeed!');

    const app = express();
    app.use(bodyParser.json({
      limit: '10mb',
      type: 'application/json'
    }));

    if (config.env === 'dev') {
      const morgan = require('morgan');
      app.use(morgan('dev'));
    }
    const { whitelist } = config.cors;
    const corsOptions = {
      origin: whitelist
    };
    app.use(cors(corsOptions));

    endpoints(app);
    // handle every other request
    app.use('/', (req, res) => {
      const warnmsg = `Endpoint not found: ${req.method} ${req.originalUrl}`;
      console.log(warnmsg);
      res.status(404).send(warnmsg);
    });

    const { port } = config.api;
    const server = http.createServer(app);
    server.listen(port, () => {
      console.log(`API Server is listenning on localhost:${port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();
