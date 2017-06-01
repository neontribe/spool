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
      return queryInterface.bulkInsert('region', [
          {
              type: 'Demo',
          },
          {
              type: 'South Shields',
          },
          {
              type: 'Liverpool',
          },
          {
              type: 'Gloucestershire',
          },
          {
              type: 'Camden',
          },
          {
              type: 'Worcestershire',
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
      return queryInterface.bulkDelete('region', null, {});
  }
};
