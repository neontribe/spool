'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
      */
      return queryInterface.bulkInsert('topic', [
          {
              type: 'work',
              name: 'Work'
          },
          {
              type: 'learning',
              name: 'Learning'
          },
          {
              type: 'home',
              name: 'Home'
          },
          {
              type: 'food',
              name: 'Food'
          },
          {
              type: 'relationships',
              name: 'People & Relationships'
          },
          {
              type: 'activities',
              name: 'Activities'
          },
          {
              type: 'travel',
              name: 'Travel'
          },
          {
              type: 'health',
              name: 'Health'
          }
      ]);
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
      */
      return queryInterface.bulkDelete('topic', null, {});
  }
};
