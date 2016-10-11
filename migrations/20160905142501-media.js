'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
      */
     
    return queryInterface.createTable('media', {
        media_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        text: {
            type: Sequelize.STRING,
        },
        video: {
            type: Sequelize.STRING,
        },
        video_thumbnail: {
            type: Sequelize.STRING,
        },
        image: {
            type: Sequelize.STRING,
        },
        image_thumbnail: {
            type: Sequelize.STRING,
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
    return queryInterface.dropTable('media');
  }
};
