"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Group, { foreignKey: "groupId" });
      User.hasMany(models.Transactions, { foreignKey: "userId" });
      //chức năng chat 
      User.hasMany(models.Message, { foreignKey: "sender_id", as: "sentMessages" });
      User.hasMany(models.Message, { foreignKey: "receiver_id", as: "receivedMessages" });

      
    }
  }
  User.init(
    {
      id: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      username: DataTypes.STRING,
      groupId : DataTypes.INTEGER,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
    }
  );
  return User;
};
