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

/* 
   CREATE TABLE entry ( entry_id INTEGER PRIMARY KEY AUTOINCREMENT, media_id INTEGER UNIQUE, author_id INTEGER, owner_id INTEGER, sentiment_type_id INTEGER, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP ); */
exports.up = function(db, cb) {
    db.createTable('entry', {
        entry_id: { type: 'int', primaryKey: true, autoIncrement: true },
        media_id: { type: 'int', unique: true },
        author_id: { type: 'int' },
        owner_id: { type: 'int' },
        sentiment_type_id: { type: 'int' },
        timestamp: { type: 'timestamp', defaultValue: 'now()'  }
    }, cb)
    return null;
};

exports.down = function(db, cb) {
    db.dropTable('entry', cb);
    return null;
};
