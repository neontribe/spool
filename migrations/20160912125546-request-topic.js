'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
      */
     return queryInterface.createTable('request_topic', {
         request_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'request',
                key: 'request_id'
            },
            onDelete: 'CASCADE'
         },
         topic_id: {
             type: Sequelize.INTEGER,
             references: {
                model: 'topic',
                key: 'topic_id'
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
     return queryInterface.dropTable('request_topic');
  }
};
