'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
      */
     
    return queryInterface.createTable('profile', {
        profile_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        age: {
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        alt_name: {
            type: Sequelize.STRING
        },
        residence_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'residence',
                key: 'residence_id'
            }
        },
        introduced: {
            type: Sequelize.BOOLEAN,
        },
        sharing: {
            type: Sequelize.BOOLEAN,
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
    return queryInterface.dropTable('profile');
  }
};
