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
        cover_image: 'cover1.jpg', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        title: 'Nhà giả kim', 
        author: 'Paulo Coelho', 
        genreId: genres.find(g => g.name === 'Tiểu thuyết').id, 
        quantity: 10, 
        cover_image: 'cover2.jpg', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        title: 'Lịch sử Việt Nam', 
        author: 'Trần Quốc Vượng', 
        genreId: genres.find(g => g.name === 'Lịch sử').id, 
        quantity: 7, 
        cover_image: 'cover3.jpg', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Books', null, {});
  }
}; 