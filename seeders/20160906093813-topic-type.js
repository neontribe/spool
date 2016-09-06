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
      return queryInterface.bulkInsert('topic_type', [
          {
              type: 'transport',
              name: 'Transport'
          },
          {
              type: 'education',
              name: 'Education'
          },
          {
              type: 'home',
              name: 'Home'
          },
          {
              type: 'leisure',
              name: 'Leisure'
          },
          {
              type: 'health',
              name: 'Health'
          },
          {
              type: 'food',
              name: 'Food'
          },
          {
              type: 'sport',
              name: 'Sport'
          },
          {
              type: 'work',
              name: 'Work'
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
      return queryInterface.bulkDelete('topic_type', null, {});
  }
};
