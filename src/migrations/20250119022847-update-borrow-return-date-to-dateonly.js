module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Transactions', 'borrow_date', {
      type: Sequelize.DATEONLY,
      allowNull: true, // hoặc false tùy vào yêu cầu của bạn
    });
    await queryInterface.changeColumn('Transactions', 'return_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Transactions', 'borrow_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn('Transactions', 'return_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
};
