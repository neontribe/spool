'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('user_request', {
        user_request_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        request_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'request',
                key: 'request_id'
            },
            onDelete: 'CASCADE'
        },
        user_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'user_account',
                key: 'user_id'
            },
            onDelete: 'CASCADE'
        },
        seen: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        created_at: { 
            type: Sequelize.DATE
        },
        updated_at: { 
            type: Sequelize.DATE
        },
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
      return queryInterface.dropTable('user_request');
  }
};
