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

/* CREATE TABLE x_entry_topics ( entry_id INTEGER, topic_type_id INTEGER ); */
exports.up = function(db, cb) {
    db.createTable('x_entry_topics', {
        entry_id: { type: 'int' },
        topic_type_id: { type: 'int' },
    }, cb)
    return null;
};

exports.down = function(db, cb) {
    db.dropTable('x_entry_topics', cb);
    return null;
};
