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
      return queryInterface.bulkInsert('region_service', [
          {
              region_id: 1,
              service_id: 1,
          },
          {
              region_id: 1,
              service_id: 2,
          },
          {
              region_id: 5,
              service_id: 3
          },
          {
              region_id: 2,
              service_id: 4
          },
          {
              region_id: 2,
              service_id: 5
          },
          {
              region_id: 3,
              service_id: 6
          },
          {
              region_id: 3,
              service_id: 7
          },
          {
              region_id: 3,
              service_id: 8
          },
          {
              region_id: 4,
              service_id: 9
          },
          {
              region_id: 4,
              service_id: 10
          },
          {
              region_id: 4,
              service_id: 11
          },
          {
              region_id: 6,
              service_id: 12
          },
          {
              region_id: 6,
              service_id: 13
          },
          {
              region_id: 6,
              service_id: 14
          },
          {
              region_id: 3,
              service_id: 15
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
      return queryInterface.bulkDelete('region_service', null, {});
  }
};
