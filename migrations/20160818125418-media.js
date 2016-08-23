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

/* CREATE TABLE media ( media_id INTEGER PRIMARY KEY AUTOINCREMENT, type_id INTEGER, text TEXT ); */
exports.up = function(db, cb) {
    db.createTable('media', {
        media_id: { type: 'int', primaryKey: true, autoIncrement: true },
        type_id: { type: 'int' },
        text: { type: 'text' },
        video: { type: 'text' },
        thumbnail: { type: 'text' }
    }, cb)
    return null;
};

exports.down = function(db, cb) {
    db.dropTable('media', cb);
    return null;
};
