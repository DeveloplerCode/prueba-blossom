'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // El método 'up' se ejecuta cuando aplicas la migración
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Characters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER // Tipo de dato para ID
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      species: {
        type: Sequelize.STRING,
        allowNull: false
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false
      },
      origin: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  // El método 'down' se ejecuta cuando deshaces la migración
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Characters');
  }
};