'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Genres', null, {});
    
    await queryInterface.bulkInsert('Genres', [
      { name: 'Khoa học', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tiểu thuyết', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Lịch sử', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Genres', null, {});
  }
}; 