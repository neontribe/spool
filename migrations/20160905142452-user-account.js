'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
      */
      return queryInterface.createTable('user_account', {
          user_id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              autoIncrement: true
          },
          auth_hash: {
              type: Sequelize.STRING,
          },
          role_type_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'role_type',
                key: 'role_type_id'
            }
          },
          region_type_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'region_type',
                key: 'region_type_id'
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
     return queryInterface.dropTable('user_account')
  }
};
