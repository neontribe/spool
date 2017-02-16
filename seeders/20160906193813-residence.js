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
      return queryInterface.bulkInsert('residence', [
          {
              type: 'family',
              name: 'With Family'
          },
          {
              type: 'independent',
              name: 'Independent'
          },
          {
              type: 'supported',
              name: 'Supported Living'
          },
      ]);
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
      */
      return queryInterface.bulkDelete('residence', null, {});
  }
};
