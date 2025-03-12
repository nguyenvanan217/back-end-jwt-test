'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Groups', null, {});
    
    // Reset auto-increment
    await queryInterface.sequelize.query('ALTER TABLE Groups AUTO_INCREMENT = 1;');

    const groups = [
      { id: 1, name: 'Quản Lý Thư Viện', description: 'Quản trị viên - có toàn quyền quản lý hệ thống' },
      { id: 2, name: 'Sinh Viên', description: 'Sinh viên - chỉ có quyền đăng ký, đăng nhập và xem sách' },
    ].map(group => ({
      ...group,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('Groups', groups);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Groups', null, {});
  }
}; 