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
      Transactions.belongsTo(models.User, { foreignKey: "userId" });
      Transactions.belongsTo(models.Book, { foreignKey: "bookId" });

    }
  }
  Transactions.init(
    {
      bookId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      borrow_date: DataTypes.DATEONLY,
      return_date: DataTypes.DATEONLY,      
      status: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Transactions",
      tableName: "Transactions",
    }
  );
  return Transactions;
};
