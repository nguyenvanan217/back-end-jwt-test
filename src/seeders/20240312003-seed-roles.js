'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
    
    // Reset auto-increment
    await queryInterface.sequelize.query('ALTER TABLE Roles AUTO_INCREMENT = 1;');

    const roles = [
      { id: 1, url: '/account', description: 'xử lý khi load lại trang ở front end giúp không mất thông tin của context phía front end' },
      { id: 2, url: '/register', description: 'Đăng ký tài khoản' },
      { id: 3, url: '/login', description: 'Đăng nhập' },
      { id: 4, url: '/logout', description: 'Đăng xuất' },
      { id: 5, url: '/books/read', description: 'Xem danh sách sách' },
      { id: 6, url: '/books/create', description: 'Thêm sách mới' },
      { id: 7, url: '/books/delete', description: 'Xóa sách' },
      { id: 8, url: '/books/update', description: 'Cập nhật sách' },
      { id: 9, url: '/users/read', description: 'Xem danh sách người dùng' },
      { id: 10, url: '/users/delete', description: 'Xóa người dùng' },
      { id: 11, url: '/users/get-all-user-infor', description: 'Xem thông tin chi tiết tất cả người dùng' },
      { id: 12, url: '/users/update', description: 'Cập nhật người dùng' },
      { id: 13, url: '/transactions/create', description: 'Tạo giao dịch' },
      { id: 14, url: '/transactions/resolve-violation', description: 'Xử lý vi phạm' },
      { id: 15, url: '/transactions/update-date-and-status', description: 'Cập nhật ngày và trạng thái' },
      { id: 16, url: '/transactions/autoupdatestatus', description: 'Tự động cập nhật trạng thái' },
      { id: 17, url: '/transactions/delete', description: 'Xóa giao dịch' },
      { id: 18, url: '/genres/read', description: 'Xem thể loại' },
      { id: 19, url: '/genres/create', description: 'Thêm thể loại' },
      { id: 20, url: '/genres/delete', description: 'Xóa thể loại' },
      { id: 21, url: '/groups/read', description: 'Xem danh sách nhóm' },
      { id: 22, url: '/roles/read', description: 'Xem danh sách vai trò' },
    ].map(role => ({
      ...role,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('Roles', roles);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
}; 