const Hashids = require('hashids');

const hashids = new Hashids();

function generateUID() {
  return hashids.encode(Date.now());
}

module.exports = {
  generateUID
};
