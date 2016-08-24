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
    db.createTable('x_users_reward_types', {
        user_id: { type: 'int' },
        type_id: { type: 'int' }
    }, cb)
    return null;
};

exports.down = function(db, cb) {
    db.dropTable('x_users_reward_types', cb);
    return null;
};
