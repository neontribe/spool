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
      return queryInterface.bulkInsert('service', [
          {
              type: 'service_a',
              name: 'Service A',
          },
          {
              type: 'service_b',
              name: 'Service B',
          },
          {
              type: 'elfrida',
              name: 'Elfrida'
          },
          {
              type: 'shared_lives',   
              name: 'Shared Lives'
          },
          {
              type: 'wallace_mews',
              name: 'Wallace Mews'
          },
          {
              type: 'mowll',
              name: 'MOWLL'
          },
          {
              type: 'blue_room',
              name: 'Blue Room'
          },
          {
              type: 'transitions',
              name: 'Transitions'
          },
          {
              type: 'longhouse',
              name: 'Longhouse'
          },
          {
              type: 'the_beeches',
              name: 'The Beeches'
          },
          {
              type: 'st_roses',
              name: 'St Roses'
          },
          {
              type: 'speakeasy_now',
              name: 'Speakeasy Now'
          },
          {
              type: 'where_next',
              name: 'Where Next'
          },
          {
              type: 'samuel_place',
              name: 'Samuel Place'
          },
          {
              type: 'made',
              name: 'MADE'
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
      return queryInterface.bulkDelete('service', null, {});
  }
};
