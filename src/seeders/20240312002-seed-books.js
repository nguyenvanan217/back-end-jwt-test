'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Books', null, {});

    const genres = await queryInterface.sequelize.query(
      `SELECT id, name FROM Genres;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    await queryInterface.bulkInsert('Books', [
      { 
        title: 'Vũ trụ trong vỏ hạt dẻ', 
        author: 'Stephen Hawking', 
        genreId: genres.find(g => g.name === 'Khoa học').id, 
        quantity: 5, 
        cover_image: 'https://th.bing.com/th/id/OIP.FJOb8-U87fitBlYtFqKf9wHaK8?w=128&h=189&c=7&r=0&o=5&dpr=1.5&pid=1.7', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        title: 'Nhà giả kim', 
        author: 'Paulo Coelho', 
        genreId: genres.find(g => g.name === 'Tiểu thuyết').id, 
        quantity: 10, 
        cover_image: 'https://th.bing.com/th/id/OIP._yzetDs3gher9vBV-Ax_iAHaL0?w=117&h=187&c=7&r=0&o=5&dpr=1.5&pid=1.7', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        title: 'Lịch sử Việt Nam', 
        author: 'Trần Quốc Vượng', 
        genreId: genres.find(g => g.name === 'Lịch sử').id, 
        quantity: 7, 
        cover_image: 'https://th.bing.com/th/id/OIP._g9GwtOSkaHflHYNY9YGQwHaLF?w=151&h=220&c=7&r=0&o=5&dpr=1.5&pid=1.7', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Books', null, {});
  }
}; 