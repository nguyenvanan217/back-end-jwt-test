"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Seed Users
    await queryInterface.bulkInsert("User", [
      {
        id: 1,
        email: "Admin@gmail.com",
        password: "hashed_password_1", // Thay bằng hash của mật khẩu thật
        username: "Nguyễn An",
        groupId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        email: "lebinh@gmail.com",
        password: "hashed_password_2", // Thay bằng hash của mật khẩu thật
        username: "Lê Hữu Bình",
        groupId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Seed Groups
    await queryInterface.bulkInsert("Group", [
      {
        id: 1,
        name: "librarian",
        description: "quản trị viên",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "reader",
        description: "người dùng",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Seed Roles
    await queryInterface.bulkInsert("Role", [
      {
        id: 1,
        url: "user/read",
        description: "xem danh sách người",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        url: "user/create",
        description: "tạo người dùng mới",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        url: "user/delete",
        description: "xóa người dùng",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        url: "user/view",
        description: "xem sách",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Seed Group_Role
    await queryInterface.bulkInsert("groupRole", [
      {
        id: 1,
        groupId: 1,
        groupId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        groupId: 1,
        groupId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        groupId: 2,
        groupId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Seed Genress
    await queryInterface.bulkInsert("Genres", [
      {
        id: 1,
        name: "cổ tích",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Seed Books
    await queryInterface.bulkInsert("Book", [
      {
        id: 1,
        title: "tây du ký",
        author: "ngô thừa ân",
        genreId: 1,
        quantity: 2,
        cover_image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    // Seed Transactions
    await queryInterface.bulkInsert("Transactions", [
      {
        id: 1,
        bookId: 1,
        userId: 2,
        borrow_date: new Date("2024-10-20"),
        return_date: new Date("2024-11-21"),
        status: "complete",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Reverse seed
    await queryInterface.bulkDelete("User", null, {});
    await queryInterface.bulkDelete("Group", null, {});
    await queryInterface.bulkDelete("Role", null, {});
    await queryInterface.bulkDelete("groupRole", null, {});
    await queryInterface.bulkDelete("Genres", null, {});
    await queryInterface.bulkDelete("Book", null, {});
    await queryInterface.bulkDelete("Transactions", null, {});
  },
};
