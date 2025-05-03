'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
    
    // Reset auto-increment
    await queryInterface.sequelize.query('ALTER TABLE Roles AUTO_INCREMENT = 1;');

    const roles = [
      { id: 1, url: '/account', description: 'Duy trì đăng nhập khi chuyển trang' },
      { id: 2, url: '/register', description: 'Đăng ký tài khoản' },
      { id: 3, url: '/login', description: 'Đăng nhập' },
      { id: 4, url: '/logout', description: 'Đăng xuất' },
      { id: 5, url: '/books/read', description: 'Xem danh sách sách' },
      { id: 6, url: '/books/create', description: 'Thêm sách mới' },
      { id: 7, url: '/books/delete', description: 'Xóa sách' },
      { id: 8, url: '/books/update', description: 'Cập nhật sách' },
      { id: 9, url: '/users/read', description: 'Xem danh sách người dùng' },
      { id: 10, url: '/users/get-detail', description: 'Xem thông tin mượn trả của bản thân' },
      { id: 11, url: '/users/delete', description: 'Xóa người dùng' },
      { id: 12, url: '/users/get-all-user-infor', description: 'Xem thông tin chi tiết tất cả người dùng' },
      { id: 13, url: '/users/update', description: 'Cập nhật người dùng' },
      { id: 14, url: '/transactions/create', description: 'Tạo giao dịch' },
      { id: 15, url: '/transactions/resolve-violation', description: 'Xử lý vi phạm' },
      { id: 16, url: '/transactions/update-date-and-status', description: 'Cập nhật ngày và trạng thái' },
      { id: 17, url: '/transactions/autoupdatestatus', description: 'Tự động cập nhật trạng thái' },
      { id: 18, url: '/transactions/delete', description: 'Xóa giao dịch' },
      { id: 19, url: '/genres/read', description: 'Xem thể loại' },
      { id: 20, url: '/genres/create', description: 'Thêm thể loại' },
      { id: 21, url: '/genres/delete', description: 'Xóa thể loại' },
      { id: 22, url: '/groups/read', description: 'Xem danh sách nhóm' },
      { id: 23, url: '/roles/read', description: 'Xem danh sách vai trò' },
      { id: 24, url: '/roles/read-group-with-role', description: 'Xem danh sách nhóm và vai trò' },
      { id: 25, url: '/roles/update-role-for-group', description: 'Cập nhật vai trò cho nhóm người dùng' },
      { id: 26, url: '/getChatHistory', description: 'Lấy lịch sử chat' },
      { id: 27, url: '/sendMessage', description: 'Gửi tin nhắn' },
      { id: 28, url: '/getAllChat', description: 'Lấy tất cả tin nhắn' },
      { id: 29, url: '/get-admin-chat-id', description: 'Lấy ID chat của admin' },
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