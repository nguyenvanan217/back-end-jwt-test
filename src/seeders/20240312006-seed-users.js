'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});

    // Get groups
    const groups = await queryInterface.sequelize.query(
      `SELECT id, name FROM Groups;`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    console.log(groups)

    const adminGroup = groups.find(g => g.name === 'Quản Lý Thư Viện');
    const studentGroup = groups.find(g => g.name === 'Sinh Viên');
    await queryInterface.bulkInsert('Users', [
      { 
        id: 1,
        email: 'admin@gmail.com',
        username: 'Admin',
        password: '$2a$10$XCI1zvZRP0p9QRcQvVaPruUYQ.KJlEYFjpAcKc63wqBikxXIhf48a', // password: 1212
        groupId: adminGroup.id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { id: 2, email: '22T1020535@husc.edu.vn', username: 'Nguyễn Văn An', password: '$2a$10$XCI1zvZRP0p9QRcQvVaPruUYQ.KJlEYFjpAcKc63wqBikxXIhf48a', groupId: studentGroup.id, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, email: '21T1020230@husc.edu.vn', username: 'Cao Văn Tuấn Anh', password: '$2a$10$XCI1zvZRP0p9QRcQvVaPruUYQ.KJlEYFjpAcKc63wqBikxXIhf48a', groupId: studentGroup.id, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, email: '22T1020540@husc.edu.vn', username: 'Trần Đặng Quốc Anh', password: '$2a$10$XCI1zvZRP0p9QRcQvVaPruUYQ.KJlEYFjpAcKc63wqBikxXIhf48a', groupId: studentGroup.id, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, email: '22T1020546@husc.edu.vn', username: 'Nguyễn Tâm Thái Bảo', password: '$2a$10$XCI1zvZRP0p9QRcQvVaPruUYQ.KJlEYFjpAcKc63wqBikxXIhf48a', groupId: studentGroup.id, createdAt: new Date(), updatedAt: new Date() },
      { id: 6, email: '22T1020549@husc.edu.vn', username: 'Nguyễn Anh Sao Biển', password: '$2a$10$XCI1zvZRP0p9QRcQvVaPruUYQ.KJlEYFjpAcKc63wqBikxXIhf48a', groupId: studentGroup.id, createdAt: new Date(), updatedAt: new Date() },
      { id: 7, email: '22T1020557@husc.edu.vn', username: 'Hắc Tấn Có', password: '$2a$10$XCI1zvZRP0p9QRcQvVaPruUYQ.KJlEYFjpAcKc63wqBikxXIhf48a', groupId: studentGroup.id, createdAt: new Date(), updatedAt: new Date() },
      { id: 8, email: '22T1020089@husc.edu.vn', username: 'Hoàng Nhật Duy', password: '$2a$10$XCI1zvZRP0p9QRcQvVaPruUYQ.KJlEYFjpAcKc63wqBikxXIhf48a', groupId: studentGroup.id, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
