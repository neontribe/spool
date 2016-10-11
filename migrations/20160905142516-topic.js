'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable('topic', {
        topic_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: Sequelize.STRING 
        },
        name: {
            type: Sequelize.STRING 
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
    return queryInterface.dropTable('topic');
  }
};