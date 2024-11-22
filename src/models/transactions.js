"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Transactions.init(
    {
      bookId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      borrow_date: DataTypes.DATE,
      return_date: DataTypes.DATE,
      status: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Transactions",
    }
  );
  return Transactions;
};
