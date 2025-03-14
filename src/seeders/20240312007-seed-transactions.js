'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Transactions', null, {});

    // Lấy danh sách user mới tạo
    const users = await queryInterface.sequelize.query(
      `SELECT id, username FROM Users;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Lấy danh sách sách
    const books = await queryInterface.sequelize.query(
      `SELECT id, title FROM Books;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Tìm user theo username mới
    const admin = users.find(u => u.username === 'admin');
    const nguyenVanAn = users.find(u => u.username === 'Nguyễn Văn An');
    const caoVanTuanAnh = users.find(u => u.username === 'Cao Văn Tuấn Anh');
    
    if (!nguyenVanAn || !caoVanTuanAnh || books.length < 2) {
      console.log('Lỗi: Không tìm thấy user hoặc không đủ sách.');
      return;
    }

    await queryInterface.bulkInsert('Transactions', [
      { 
        bookId: books[0].id, 
        userId: nguyenVanAn.id, // Gán user hợp lệ
        borrow_date: '2024-01-01',
        return_date: '2024-01-10',
        status: 'Đã trả',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        bookId: books[1].id, 
        userId: nguyenVanAn.id, // Gán user hợp lệ
        borrow_date: '2024-01-01',
        return_date: '2024-01-10',
        status: 'Quá hạn',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { 
        bookId: books[1].id,
        userId: caoVanTuanAnh.id, // Gán user hợp lệ
        borrow_date: '2024-02-05',
        return_date: '2024-02-15',
        status: 'Chờ trả',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Transactions', null, {});
  }
};
