const sqlite3 = require('sqlite3');
const lib = require('./lib');

var db;
const DATABASE_FILE = './database.sqlite3';
module.exports = {
    connect: function() {
        if (!db) {
            db = new sqlite3.Database(DATABASE_FILE, function (err) {
                if (err) {
                    throw err;
                }
            });
        }
        return db;
    },
    lib
}
