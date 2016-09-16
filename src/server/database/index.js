const pg = require('pg');
const url = require('url')
const Sequelize = require('sequelize');
const models = require('./models');

if (!process.env.DATABASE_URL) {
    throw new Error('Cannot find DATABASE_URL in environment variables');
}

const params = url.parse(process.env.DATABASE_URL);
const auth = params.auth.split(':');

const config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
};

var sequelize = new Sequelize(config.database, config.user, config.password, {
    host: config.host,
    dialect: 'postgres',
    port: config.port,
    pool: {
        min: 0,
        max: 5,
        idle: 10000
    },
    native: true
});
models.init(sequelize);
module.exports = {
    sequelize,
    models
}
