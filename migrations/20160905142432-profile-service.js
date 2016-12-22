'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
      */
     return queryInterface.createTable('profile_service', {
         profile_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'profile',
                key: 'profile_id'
            }
         },
         service_id: {
             type: Sequelize.INTEGER,
             references: {
                model: 'service',
                key: 'service_id'
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
     return queryInterface.dropTable('profile_service');
  }
};
