var getbabelRelayPlugin = require('babel-relay-plugin');
var schema = require('../config/schema.json');

module.exports = getbabelRelayPlugin(schema.data);
