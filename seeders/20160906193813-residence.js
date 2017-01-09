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
              type: 'residence_a',
              name: 'Residence A'
          },
          {
              type: 'residence_b',
              name: 'Residence B'
          },
          {
              type: 'residence_c',
              name: 'Residence C'
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
