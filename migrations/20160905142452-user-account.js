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
              type: Sequelize.STRING(256),
          },
          sharing: {
              type: Sequelize.BOOLEAN,
          },
          role_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'role',
                key: 'role_id'
            }
          },
          region_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'region',
                key: 'region_id'
            }
          },
          created_at: { 
              type: Sequelize.DATE
          },
          updated_at: { 
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
