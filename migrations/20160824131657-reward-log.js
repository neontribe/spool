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

exports.up = function(db, cb) {
    db.createTable('reward_log', {
        reward_type_id: { type: 'int' },
        user_id: { type: 'int' },
        timestamp: { type: 'timestamp' }
    }, cb)
    return null;
};

exports.down = function(db, cb) {
    db.dropTable('reward_log');
    return null;
};
