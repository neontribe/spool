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

/* CREATE TABLE topic_type ( topic_type_id INTEGER PRIMARY KEY AUTOINCREMENT, type STRING UNIQUE ); */
exports.up = function(db, cb) {
    db.createTable('topic_type', {
        topic_type_id: { type: 'int', primaryKey: true, autoIncrement: true },
        type: { type: 'string', unique: true },
    }, cb)
    return null;
};

exports.down = function(db, cb) {
    db.dropTable('topic_type', cb);
    return null;
};