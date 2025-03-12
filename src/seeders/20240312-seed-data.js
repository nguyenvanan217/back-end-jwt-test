'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Xóa dữ liệu cũ trước khi seed
    await queryInterface.bulkDelete('Transactions', null, {});
    await queryInterface.bulkDelete('Books', null, {});
    await queryInterface.bulkDelete('Genres', null, {});
    await queryInterface.bulkDelete('GroupRoles', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
    await queryInterface.bulkDelete('Groups', null, {});
    await queryInterface.bulkDelete('Users', null, {});

    // Seed dữ liệu cho Genres
    await queryInterface.bulkInsert('Genres', [
      { name: 'Khoa học', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tiểu thuyết', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Lịch sử', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Seed dữ liệu cho Books
    await queryInterface.bulkInsert('Books', [
      { title: 'Vũ trụ trong vỏ hạt dẻ', author: 'Stephen Hawking', genreId: 1, quantity: 5, cover_image: 'cover1.jpg', createdAt: new Date(), updatedAt: new Date() },
      { title: 'Nhà giả kim', author: 'Paulo Coelho', genreId: 2, quantity: 10, cover_image: 'cover2.jpg', createdAt: new Date(), updatedAt: new Date() },
      { title: 'Lịch sử Việt Nam', author: 'Trần Quốc Vượng', genreId: 3, quantity: 7, cover_image: 'cover3.jpg', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Seed dữ liệu cho Roles
    await queryInterface.bulkInsert('Roles', [
      { url: '/account', description: ' xử lý khi load lại trang ở front end giúp không mất thông tin của context phía front end', createdAt: new Date(), updatedAt: new Date() },
      { url: '/register', description: 'Đăng ký tài khoản', createdAt: new Date(), updatedAt: new Date() },
      { url: '/login', description: 'Đăng nhập', createdAt: new Date(), updatedAt: new Date() },
      { url: '/logout', description: 'Đăng xuất', createdAt: new Date(), updatedAt: new Date() },

      { url: '/books/read', description: 'Xem danh sách sách', createdAt: new Date(), updatedAt: new Date() },
      { url: '/books/create', description: 'Thêm sách mới', createdAt: new Date(), updatedAt: new Date() },
      { url: '/books/delete', description: 'Xóa sách', createdAt: new Date(), updatedAt: new Date() },
      { url: '/books/update', description: 'Cập nhật sách', createdAt: new Date(), updatedAt: new Date() },
     
      { url: '/users/read', description: 'Xem danh sách người dùng', createdAt: new Date(), updatedAt: new Date() },
      { url: '/users/delete', description: 'Xóa người dùng', createdAt: new Date(), updatedAt: new Date() },
      { url: '/users/get-all-user-infor', description: 'Xem thông tin chi tiết tất cả người dùng', createdAt: new Date(), updatedAt: new Date() },
      { url: '/users/update', description: 'Cập nhật người dùng', createdAt: new Date(), updatedAt: new Date() },
      
      { url: '/transactions/create', description: 'Tạo giao dịch', createdAt: new Date(), updatedAt: new Date() },
      { url: '/transactions/resolve-violation', description: 'Xử lý vi phạm', createdAt: new Date(), updatedAt: new Date() },
      { url: '/transactions/update-date-and-status', description: 'Cập nhật ngày và trạng thái', createdAt: new Date(), updatedAt: new Date() },
      { url: '/transactions/autoupdatestatus', description: 'Tự động cập nhật trạng thái', createdAt: new Date(), updatedAt: new Date() },
      { url: '/transactions/delete', description: 'Xóa giao dịch', createdAt: new Date(), updatedAt: new Date() },
      
      { url: '/genres/read', description: 'Xem thể loại', createdAt: new Date(), updatedAt: new Date() },
      { url: '/genres/create', description: 'Thêm thể loại', createdAt: new Date(), updatedAt: new Date() },
      { url: '/genres/delete', description: 'Xóa thể loại', createdAt: new Date(), updatedAt: new Date() },

      { url: '/groups/read', description: 'Xem danh sách nhóm', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Seed dữ liệu cho Groups
    await queryInterface.bulkInsert('Groups', [
      { name: 'Quản Lý Thư Viện', description: 'Quản trị viên - có toàn quyền quản lý hệ thống', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Sinh Viên', description: 'Sinh viên - chỉ có quyền đăng ký, đăng nhập và xem sách', createdAt: new Date(), updatedAt: new Date() },
    ]);

    // Seed dữ liệu cho GroupRoles (Phân quyền)
    await queryInterface.bulkInsert('GroupRoles', [
      // Quyền cho Student (roleId: 1 = register, 2 = login, 3 = view books)
      { groupId: 2, roleId: 1, createdAt: new Date(), updatedAt: new Date() },
      { groupId: 2, roleId: 2, createdAt: new Date(), updatedAt: new Date()},
      { groupId: 2, roleId: 3, createdAt: new Date(), updatedAt: new Date() },
      { groupId: 2, roleId: 4, createdAt: new Date(), updatedAt: new Date() },
      { groupId: 2, roleId: 5, createdAt: new Date(), updatedAt: new Date() },

      
      // Quyền cho Admin (tất cả các quyền từ 1-21)
      ...Array.from({ length: 21 }, (_, i) => ({
        groupId: 1,
        roleId: i + 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    ]);

    // Seed dữ liệu cho Users
    await queryInterface.bulkInsert('Users', [
      { 
        email: 'admin@library.com',
        username: 'admin',
        password: '$2a$10$K8ZpdrjwzUWSTmtyM.SAHewu7Zxpq3kUXnv/DPVR8M/P4m/q9/4dy', // password: 123456
        groupId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'student1@library.com',
        username: 'student1',
        password: '$2a$10$K8ZpdrjwzUWSTmtyM.SAHewu7Zxpq3kUXnv/DPVR8M/P4m/q9/4dy', // password: 123456
        groupId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'student2@library.com',
        username: 'student2',
        password: '$2a$10$K8ZpdrjwzUWSTmtyM.SAHewu7Zxpq3kUXnv/DPVR8M/P4m/q9/4dy', // password: 123456
        groupId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Seed dữ liệu cho Transactions
    await queryInterface.bulkInsert('Transactions', [
      { bookId: 1, userId: 2, borrow_date: '2024-01-01', return_date: '2024-01-10', status: 'Returned', createdAt: new Date(), updatedAt: new Date() },
      { bookId: 2, userId: 3, borrow_date: '2024-02-05', return_date: '2024-02-15', status: 'Borrowed', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Xóa dữ liệu khi rollback
    await queryInterface.bulkDelete('Transactions', null, {});
    await queryInterface.bulkDelete('Books', null, {});
    await queryInterface.bulkDelete('Genres', null, {});
    await queryInterface.bulkDelete('GroupRoles', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
    await queryInterface.bulkDelete('Groups', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
