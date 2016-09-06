'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
      */
      return queryInterface.createTable('entry', {
          entry_id: { 
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true 
          },
          /* we do not cascade author deletions, we should handle this in our app since author will need to be migrated to the owner */
          author_id: { 
              type: Sequelize.INTEGER,
              references: {
                  model: 'user_account',
                  key: 'user_id'
              },
              onDelete: 'SET NULL'
          },
          owner_id: { 
              type: Sequelize.INTEGER,
              references: {
                  model: 'user_account',
                  key: 'user_id'
              },
              onDelete: 'CASCADE'
          },
          sentiment_type_id: { 
              type: Sequelize.INTEGER,
              references: {
                  model: 'sentiment_type',
                  key: 'sentiment_type_id'
              }
          },
          timestamp: { 
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
      return queryInterface.dropTable('entry');
  }
};
