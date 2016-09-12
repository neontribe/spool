'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
      return queryInterface.createTable('request', {
          request_id: { 
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true 
          },
          user_id: { 
              type: Sequelize.INTEGER,
              references: {
                  model: 'user_account',
                  key: 'user_id'
              },
//              onDelete: 'CASCADE' ? hmm
          },
          start: { 
              type: Sequelize.DATE
          },
          end: { 
              type: Sequelize.DATE
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
      return queryInterface.dropTable('request');
  }
};
