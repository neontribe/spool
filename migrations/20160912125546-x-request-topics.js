'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
      */
     return queryInterface.createTable('x_request_topics', {
         request_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'request',
                key: 'request_id'
            },
            onDelete: 'CASCADE'
         },
         topic_type_id: {
             type: Sequelize.INTEGER,
             references: {
                model: 'topic_type',
                key: 'topic_type_id'
             }
         }
    })
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
     return queryInterface.dropTable('x_request_topics');
  }
};
