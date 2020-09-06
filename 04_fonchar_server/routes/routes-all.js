const assert = require('assert');

const { resolve } = require('path');

const { PROXY_PREFIX } = require('../config');

function requiresOk() {
  return true;
}
module.exports.requiresOk = requiresOk;