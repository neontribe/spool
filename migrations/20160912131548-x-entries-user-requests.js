'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
     return queryInterface.createTable('x_entries_user_requests', {
         entry_id: {
             type: Sequelize.INTEGER,
             references: {
                model: 'entry',
                key: 'entry_id'
             },
             onDelete: 'CASCADE'
         },
         user_request_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'user_request',
                key: 'user_request_id'
            },
            onDelete: 'CASCADE'
         },
         access: {
             type: Sequelize.BOOLEAN,
             defaultValue: false
         }
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
      */
     return queryInterface.dropTable('x_entries_user_requests');
  }
};
