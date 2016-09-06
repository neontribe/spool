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
          media_id: { 
              type: Sequelize.INTEGER
          },
          author_id: { 
              type: Sequelize.INTEGER
          },
          owner_id: { 
              type: Sequelize.INTEGER
          },
          sentiment_type_id: { 
              type: Sequelize.INTEGER
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
