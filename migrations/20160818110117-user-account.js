'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

/* CREATE TABLE user ( user_id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT, last_name TEXT, email TEXT ); */
exports.up = function(db, cb) {
    db.createTable('user_account', {
        user_id: { type: 'int', primaryKey: true, autoIncrement: true },
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        email: { type: 'string' }
    }, cb)
    return null;
};

exports.down = function(db, cb) {
    db.dropTable('user', cb);
    return null;
};
