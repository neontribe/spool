const pg = require('pg');
const url = require('url')

if (!process.env.DATABASE_URL) {
    console.log(process.env);
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

var connectionPool = new pg.Pool(config);
connectionPool.on('error', function (err, client) {
    //todo
   throw err;
});

module.exports = {
    connect: function() {
        var p = new Promise(function(resolve, reject) {
            connectionPool.connect(function(err, client, done) {
                if(err) {
                    return reject(err);
                }
                resolve({client, done});
            });
        });
        //todod
        p = p.catch((e) => { throw e; });
        return p;
    }
}
