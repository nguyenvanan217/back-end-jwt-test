"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('Users', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "User",
      [
        {
          email: "",
          password: "",
          userName: "John Doe1",
        },
        {
          email: "",
          password: "",
          userName: "John Doe2",
        },
        {
          email: "",
          password: "",
          userName: "John Doe3",
        },
        {
          email: "",
          password: "",
          userName: "John Doe4",
        },
        {
          email: "",
          password: "",
          userName: "John Doe5",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
