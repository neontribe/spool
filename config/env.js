// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.

var REACT_APP = /^REACT_APP_/i;
var NODE_ENV = JSON.stringify(process.env.NODE_ENV || 'development');
var AUTH0_CLIENT_ID = JSON.stringify(process.env.AUTH0_CLIENT_ID || 'missing');
var AUTH0_DOMAIN = JSON.stringify(process.env.AUTH0_DOMAIN || 'missing');
var VERSION = JSON.stringify(process.env.npm_package_version || 'missing');

module.exports = Object
  .keys(process.env)
  .filter(key => REACT_APP.test(key))
  .reduce((env, key) => {
      env['process.env.' + key] = JSON.stringify(process.env[key]);
      return env;
  }, {
      'process.env.NODE_ENV': NODE_ENV,
      'process.env.AUTH0_CLIENT_ID': AUTH0_CLIENT_ID,
      'process.env.AUTH0_DOMAIN': AUTH0_DOMAIN,
      'process.env.VERSION': VERSION
  });
