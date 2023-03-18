'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('files', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      commentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'comments', key: 'id' },
      },
      name: { type: Sequelize.STRING, allowNull: false },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('files');
  },
};
